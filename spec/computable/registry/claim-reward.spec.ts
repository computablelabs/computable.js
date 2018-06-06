import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract, Block } from '../../../node_modules/web3/types.d'
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

fdescribe('Registry: Claim Reward', () => {
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

  it('should transfer the correct number of tokens once a challenge has been resolved', async () => {
    const listBytes = stringToBytes(web3, 'listing.com')

    // Apply
    const tx1 = await registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT)
    expect(tx1).toBeTruthy()
    const applicantStartingBal = maybeParseInt(await eip20.balanceOf(applicant))

    // Challenge
    const challID = eventReturnValues('_Challenge',
      await registry.challenge(listBytes, '', { from: challenger }), 'challengeID')
    expect(challID).toBeTruthy()


    // Commit applicant vote 
    const tx2 = await voting.commitVote(web3, challID, applicant, 0, 500, 420)
    //expect(tx2).toBeTruthy()
  })

})
