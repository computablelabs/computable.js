import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract, Block } from 'web3/types.d'
import Erc20 from '../../../src/contracts/erc-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'
import { ParameterDefaults, NAME } from '../../../src/constants'
import {
  deployDll,
  deployAttributeStore,
  maybeParseInt,
  onData,
  eventReturnValues,
  stringToBytes,
  increaseTime,
} from '../../../src/helpers'

let web3:Web3,
  server:any,
  provider:any,
  accounts:string[],
  erc20:Erc20,
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

describe('Registry: Claim Reward', () => {
  beforeAll(() => {
    server = ganache.server({ws:true})
    server.listen(8556)

    provider = new Web3.providers.WebsocketProvider('ws://localhost:8556')
    web3 = new Web3(provider)
  })

  afterAll(() => {
    server.close()
    server = null
  })

  beforeEach(async () => {
    [owner, applicant, challenger, voter, proposer] = await web3.eth.getAccounts()

    erc20 = new Erc20(owner)
    const tokenAddress = await erc20.deploy(web3)
    erc20.setProvider(provider)

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

    await erc20.approve(registryAddress, 1000000)

    // applicant needs funding
    await erc20.transfer(applicant, 500000)
    await erc20.approve(registryAddress, 250000, { from: applicant })
    await erc20.approve(parameterizerAddress, 250000, { from: applicant })

    // challenger needs funding
    await erc20.transfer(challenger, 500000)
    await erc20.approve(registryAddress, 250000, { from: challenger })
    await erc20.approve(parameterizerAddress, 250000, { from: challenger })

    // voter needs funding
    await erc20.transfer(voter, 600000)
    await erc20.approve(registryAddress, 200000, { from: voter })
    await erc20.approve(parameterizerAddress, 200000, { from: voter })
    await erc20.approve(votingAddress, 200000, { from: voter })

    // funds for proposer
    await erc20.transfer(proposer, 100000)
    await erc20.approve(parameterizerAddress, 100000, { from: proposer })
  })

  it('should transfer the correct number of tokens once a challenge has been resolved', async () => {
    const listBytes = stringToBytes(web3, 'listing.net'),
      voterStartingBalance = maybeParseInt(await erc20.balanceOf(voter))

    // Apply
    const tx1 = registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT, '', { from: applicant })
    expect(tx1).toBeTruthy()

    // get the event emitter for the _Challenge event before causing it to be fired
    const emitter = registry.getEventEmitter('_Challenge')

    // Challenge, we don't have to await this as we will await the message back below
    registry.challenge(listBytes, '', { from: challenger })

    // the desired event attribute can be pulled from the raw EventLog with `eventReturnValues`
    const id = eventReturnValues('id', await onData(emitter))

    expect(id).toBeTruthy()

    // Commit vote
    // 1 serving as a truthy vote for the challenged, i.e a falsy vote and it would not be listed
    await voting.commitVote(web3, id, voter, 0, 10, 420)
    await increaseTime(provider, ParameterDefaults.COMMIT_STAGE_LENGTH + 1)

    // Reveal vote
    await voting.revealVote(id, 0, 420, { from: voter })
    await increaseTime(provider, ParameterDefaults.REVEAL_STAGE_LENGTH + 1)
    await registry.updateStatus(listBytes)

    expect(await registry.isWhitelisted(listBytes)).toBe(false)

    // Compute voter reward
    const voterReward = maybeParseInt(await registry.voterReward(voter, id, 420))
    const voterExpectedBalance = voterStartingBalance + voterReward

    // Voter claims reward
    await registry.claimReward(id, 420, {from: voter})

    // Voter withdraws voting rights
    await voting.withdrawVotingRights(10, {from: voter})

    // Get final voter balance
    const voterFinalBalance = maybeParseInt(await erc20.balanceOf(voter))

    // Compare expected final balance with actual final balance
    expect(voterFinalBalance).toBe(voterExpectedBalance)
  })

})
