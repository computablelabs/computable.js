import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import {
  deployToken,
  deployDll,
  deployAttributeStore,
  deployVoting,
  deployParameterizer,
  increaseTime,
} from '../../helpers'
import { ParameterDefaults } from '../../../src/constants'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Contract,
  dll:Contract,
  store:Contract,
  voting:Contract,
  parameterizer:Contract

// TODO this is on hold until the voting contract and its dependencies are spec'd
describe('Parameterizer: challengeCanBeResolved', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = await deployToken(web3, accounts[0])
    eip20.setProvider(provider)
    const tokenAddress = eip20.options.address

    // voting and its dependencies are required, TODO we _could_ bundle these and perhaps still return the inidividual instances
    // `{ dll, store, voting } = deployVotingAndLibraries` perhaps...
    dll = await deployDll(web3, accounts[0])
    dll.setProvider(provider)
    const dllAddress = dll.options.address

    store = await deployAttributeStore(web3, accounts[0])
    store.setProvider(provider)
    const storeAddress = store.options.address

    voting = await deployVoting(web3, accounts[0], dllAddress, storeAddress, tokenAddress)
    voting.setProvider(provider)
    const votingAddress = voting.options.address

    parameterizer = await deployParameterizer(web3, accounts[0], tokenAddress, votingAddress) // THREE placeholding plcr TODO
    parameterizer.setProvider(provider)
    const parameterizerAddress = parameterizer.options.address

    // approve the parameterizer with the token, account[0] has all the balance atm
    await eip20.methods.approve(parameterizerAddress, 1000000).send({ from: accounts[0] })
    // challenger (accounts[1]) needs token funds to spend
    await eip20.methods.transfer(accounts[1], 500000).send({ from: accounts[0] })
    // parameterizer must be approved to spend on [1]'s behalf
    await eip20.methods.approve(parameterizerAddress, 450000).send({ from: accounts[1] })
  })

  it('should be truthy if a challenge is ready to be resolved', async () => {
    const tx = await parameterizer.methods.proposeReparameterization('voteQuorum', 51).send({ from: accounts[0] })
    expect(tx).toBeTruthy()

    // propID is nested in the event TODO change to using the event listener when they work
    const propID = tx.events._ReparameterizationProposal.returnValues.propID

    const tx1 = await parameterizer.methods.challengeReparameterization(propID).send({ from: accounts[1] })
    expect(tx1).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    await increaseTime(provider, ParameterDefaults.P_REVEAL_STAGE_LENGTH + 1)

    const res = await parameterizer.methods.challengeCanBeResolved(propID).call()
    expect(res).toBe(true)
  })

  it('should be falsy if challenge not ready', async () => {
    const tx = await parameterizer.methods.proposeReparameterization('voteQuorum', 51).send({ from: accounts[0] })
    expect(tx).toBeTruthy()

    // propID is nested in the event TODO change to using the event listener when they work
    const propID = tx.events._ReparameterizationProposal.returnValues.propID

    const tx1 = await parameterizer.methods.challengeReparameterization(propID).send({ from: accounts[1] })
    expect(tx1).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    // NOTE reveal stage length is the determining factor here

    const res = await parameterizer.methods.challengeCanBeResolved(propID).call()
    expect(res).toBe(false)
  })

})
