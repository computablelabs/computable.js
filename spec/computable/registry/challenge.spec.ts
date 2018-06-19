import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract, Block } from 'web3/types.d'
import { stringToBytes, increaseTime, whitelist } from '../../helpers'
import Eip20 from '../../../src/contracts/eip-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'
import { ParameterDefaults, NAME } from '../../../src/constants'
import { RegistryListing, Challenge } from '../../../src/interfaces'
import {
  deployDll,
  deployAttributeStore,
  maybeParseInt,
  eventReturnValues,
} from '../../../src/helpers'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let eip20:Eip20,
  dll:Contract,
  store:Contract,
  voting:Voting,
  parameterizer:Parameterizer,
  registry:Registry,
  owner:string,
  applicant:string,
  challenger:string,
  voter:string,
  proposer:string

// TODO also displays timing issues with WS server ascertain...
describe('Registry: Challenge', () => {
  beforeEach(async () => {
    [owner, applicant, challenger, voter, proposer] = await web3.eth.getAccounts()

    eip20 = new Eip20(owner)
    const tokenAddress = await eip20.deploy(web3)
    eip20.setProvider(provider)

    dll = await deployDll(web3, owner)
    dll.setProvider(provider)
    const dllAddress = dll.options.address

    store = await deployAttributeStore(web3, owner)
    store.setProvider(provider)
    const attributeStoreAddress = store.options.address

    voting = new Voting(owner)
    const votingAddress = await voting.deploy(web3, { tokenAddress, dllAddress, attributeStoreAddress })
    voting.setProvider(provider)

    parameterizer = new Parameterizer(owner)
    const parameterizerAddress = await parameterizer.deploy(web3, { tokenAddress, votingAddress })
    parameterizer.setProvider(provider)

    registry = new Registry(owner)
    const registryAddress = await registry.deploy(web3, { tokenAddress, votingAddress, parameterizerAddress, name: NAME })
    registry.setProvider(provider)

    //owner approves voting and reg to spend
    // await eip20.approve(votingAddress, 1000000)
    await eip20.approve(registryAddress, 1000000)

    // applicant needs funding
    await eip20.transfer(applicant, 500000)
    await eip20.approve(registryAddress, 250000, { from: applicant })
    await eip20.approve(parameterizerAddress, 250000, { from: applicant })

    // challenger needs funding
    await eip20.transfer(challenger, 500000)
    await eip20.approve(registryAddress, 250000, { from: challenger })
    await eip20.approve(parameterizerAddress, 250000, { from: challenger })

    // voter needs funding
    await eip20.transfer(voter, 600000)
    await eip20.approve(registryAddress, 200000, { from: voter })
    await eip20.approve(parameterizerAddress, 200000, { from: voter })
    await eip20.approve(votingAddress, 200000, { from: voter })

    // funds for proposer
    await eip20.transfer(proposer, 100000)
    await eip20.approve(parameterizerAddress, 100000, { from: proposer })
  })

  it('should challenge an application', async () => {
    const listBytes = stringToBytes(web3, 'listing.net'),
      challengerStartingBal = maybeParseInt(await eip20.balanceOf(challenger))

    const tx1 = registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT, '', { from: applicant })
    expect(tx1).toBeTruthy()

    const challID = eventReturnValues('_Challenge',
      await registry.challenge(listBytes, '', { from: challenger }), 'challengeID')
    expect(challID).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.COMMIT_STAGE_LENGTH + ParameterDefaults.REVEAL_STAGE_LENGTH + 1)
    await registry.updateStatus(listBytes)

    const isWhitelisted = await registry.isWhitelisted(listBytes)
    // should be falsy as it is challenged
    expect(isWhitelisted).toBe(false)

    const challengerFinalBal = maybeParseInt(await eip20.balanceOf(challenger))
    // NOTE: no voters so challenger gets all of the stake
    const expectedFinalBal = challengerStartingBal + ParameterDefaults.MIN_DEPOSIT

    expect(challengerFinalBal).toBe(expectedFinalBal)
  })

  it('can challenge a listing', async () => {
    const listBytes = stringToBytes(web3, 'gunnareject.net'),
      challengerStartingBal = maybeParseInt(await eip20.balanceOf(challenger))

    // move through to whitelisted, allow min_deposit to default
    const whitelisted = await whitelist(provider, registry, listBytes, applicant)
    expect(whitelisted).toBe(true)

    const challID = eventReturnValues('_Challenge',
      await registry.challenge(listBytes, '', { from: challenger }), 'challengeID')
    expect(challID).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.COMMIT_STAGE_LENGTH + ParameterDefaults.REVEAL_STAGE_LENGTH + 1)
    await registry.updateStatus(listBytes)
    expect(await registry.isWhitelisted(listBytes)).toBe(false) // should revert to falsy with challenge

    // token dispensation as the first spec, all to challenger as there were no voters
    const challengerFinalBal = maybeParseInt(await eip20.balanceOf(challenger))
    // NOTE: no voters so challenger gets all of the stake
    const expectedFinalBal = challengerStartingBal + ParameterDefaults.MIN_DEPOSIT

    expect(challengerFinalBal).toBe(expectedFinalBal)
  })

  it('can overturn an appliction challenge', async () => {
    const listBytes = stringToBytes(web3, 'challengeDenied.net'),
      tx1 = registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT, '', { from: applicant })

    expect(tx1).toBeTruthy()

    const challID = eventReturnValues('_Challenge',
      await registry.challenge(listBytes, '', { from: challenger }), 'challengeID')
    expect(challID).toBeTruthy()

    // should be able to fetch the actual challenge object
    const chall:Challenge = await registry.challenges(challID)
    expect(chall).toBeTruthy()

    // 1 serving as a truthy vote for the challenged, i.e a falsy vote and it would not be listed
    await voting.commitVote(web3, challID, voter, 1, 10, 420)
    await increaseTime(provider, ParameterDefaults.COMMIT_STAGE_LENGTH + 1)
    await voting.revealVote(challID, 1, 420, { from: voter })
    await increaseTime(provider, ParameterDefaults.REVEAL_STAGE_LENGTH + 1)
    await registry.updateStatus(listBytes)

    expect(await registry.isWhitelisted(listBytes)).toBe(true)

    // check that the token dispensation is correct
    const listing:RegistryListing = await registry.listings(listBytes),
      actualUnstaked = maybeParseInt(listing.unstakedDeposit),
      expectedUnstaked = ParameterDefaults.MIN_DEPOSIT +
        (ParameterDefaults.MIN_DEPOSIT * ParameterDefaults.DISPENSATION_PCT / 100)

    expect(actualUnstaked === expectedUnstaked).toBe(true)
  })

  it('can overturn a listing challenge', async () => {
    const listBytes = stringToBytes(web3, 'winner.net'),
      // move through to whitelisted - the diff between this and the above...
      whitelisted = await whitelist(provider, registry, listBytes, applicant)

    expect(whitelisted).toBe(true)
    // challenge it...
    const challID = eventReturnValues('_Challenge',
      await registry.challenge(listBytes, '', { from: challenger }), 'challengeID')
    expect(challID).toBeTruthy()
    // vote to support
    await voting.commitVote(web3, challID, voter, 1, 10, 420)
    await increaseTime(provider, ParameterDefaults.COMMIT_STAGE_LENGTH + 1)
    await voting.revealVote(challID, 1, 420, { from: voter })
    await increaseTime(provider, ParameterDefaults.REVEAL_STAGE_LENGTH + 1)
    await registry.updateStatus(listBytes)
    // with the support vote should have succeeded
    expect(await registry.isWhitelisted(listBytes)).toBe(true)

    const listing:RegistryListing = await registry.listings(listBytes),
      actualUnstaked = maybeParseInt(listing.unstakedDeposit),
      expectedUnstaked = ParameterDefaults.MIN_DEPOSIT +
        (ParameterDefaults.MIN_DEPOSIT * ParameterDefaults.DISPENSATION_PCT / 100)

    expect(actualUnstaked === expectedUnstaked).toBe(true)
  })

  it('should touch and remove a listing with a deposit below the current min', async () => {
    const listBytes = stringToBytes(web3, 'gunnaremove.net'),
      applicantStartBal = await eip20.balanceOf(applicant),
      // move through to whitelisted
      whitelisted = await whitelist(provider, registry, listBytes, applicant)

    expect(whitelisted).toBe(true)

    // propose a new min_deposit... old one is 10
    const propID = eventReturnValues('_ReparameterizationProposal',
      await parameterizer.proposeReparameterization('minDeposit', 20, { from: proposer }), 'propID')
    expect(propID).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.P_APPLY_STAGE_LENGTH + 1)
    await parameterizer.processProposal(propID)

    const challengerStartBal = await eip20.balanceOf(challenger)
    await registry.challenge(listBytes, '', { from: challenger })
    const challengerFinalBal = await eip20.balanceOf(challenger)

    // no token change should have occured
    expect(challengerStartBal).toBe(challengerFinalBal)
    const applicantFinalBal = await eip20.balanceOf(applicant)
    expect(applicantStartBal).toBe(applicantFinalBal)
    // listing should no longer be whitelisted as it does not meet min dep requirement
    expect(await registry.isWhitelisted(listBytes)).toBe(false)
  })

  it('cannot challenge a non-existant listing', async () => {
    const listBytes = stringToBytes(web3, 'nope.com')

    try {
      await registry.challenge(listBytes, '', { from: challenger })
      // should never be hit
      expect(false).toBe(true)
    } catch(err) {
      expect(err).toBeTruthy()
    }
  })

  it('reverts if a challenge occurs on a listing with an open challenge', async () => {
    const listBytes = stringToBytes(web3, '2challenges.com'),
      whitelisted = await whitelist(provider, registry, listBytes, applicant)

    expect(whitelisted).toBe(true)

    // challenge 1
    const challID = eventReturnValues('_Challenge',
      await registry.challenge(listBytes, '', { from: challenger }), 'challengeID')
    expect(challID).toBeTruthy()

    try {
      // attempt the 2nd
      await registry.challenge(listBytes, '', { from: challenger })
      // should never be hit
      expect(false).toBe(true)
    } catch(err) {
      expect(err).toBeTruthy()
    }
  })

  it('reverts if token transfer from challenger fails', async () => {
    const listBytes = stringToBytes(web3, 'brokeasschallenger.co'),
      tx1 = registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT, '', { from: applicant })

    expect(tx1).toBeTruthy()

    // overwrite the approved amount for the challenger with 0
    await eip20.approve(registry.getAddress(), 0, { from: challenger })

    try {
      await registry.challenge(listBytes, '', { from: challenger })
      expect(false).toBe(true)
    } catch(err) {
      expect(err).toBeTruthy()
    }
  })
})
