import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract, Block } from '../../../node_modules/web3/types.d'
import { stringToBytes, increaseTime } from '../../helpers'
import Eip20 from '../../../src/contracts/eip-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'
import { ParameterDefaults, NAME } from '../../../src/constants'
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

fdescribe('Registry: Challenge', () => {
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
    await eip20.approve(votingAddress, 1000000)
    await eip20.approve(registryAddress, 1000000)

    // applicant needs funding
    await eip20.transfer(applicant, 500000)
    await eip20.approve(registryAddress, 250000, { from: applicant })
    await eip20.approve(parameterizerAddress, 250000, { from: applicant })

    // challenger needs funding
    await eip20.transfer(challenger, 500000)
    await eip20.approve(registryAddress, 250000, { from: challenger })
    await eip20.approve(parameterizerAddress, 250000, { from: challenger })
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

    // move through to whitelisted
    await registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT, '', { from: applicant })
    await increaseTime(provider, ParameterDefaults.APPLY_STAGE_LENGTH + 1)
    await registry.updateStatus(listBytes, { from: applicant })
    expect(await registry.isWhitelisted(listBytes)).toBe(true)

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
})
