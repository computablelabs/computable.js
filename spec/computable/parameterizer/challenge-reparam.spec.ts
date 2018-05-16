import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract, HttpProvider } from '../../../node_modules/web3/types.d'
import {
  commitVote,
  increaseTime,
} from '../../helpers'
import {
  deployDll,
  deployAttributeStore,
  deployVoting,
  maybeParseInt,
} from '../../../src/helpers'
import { ParameterDefaults } from '../../../src/constants'
import Parameterizer from '../../../src/contracts/parameterizer'
import Eip20 from '../../../src/contracts/eip20'

// TODO define the return of ganache.provider
const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Eip20,
  dll:Contract,
  store:Contract,
  voting:Contract,
  parameterizer:Parameterizer

describe('Parameterizer: challengeReparameterization', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = new Eip20(accounts[0])
    const tokenAddress = await eip20.deploy(web3)
    eip20.setProvider(provider)

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

    // if you pass an acct to the constructor it will be set as the default account
    parameterizer = new Parameterizer(accounts[0])
    // deploy method returns the deployed address
    const parameterizerAddress = await parameterizer.deploy(web3, { tokenAddress, votingAddress })
    parameterizer.setProvider(provider)

    // approve the parameterizer with the token, account[0] has all the balance atm (and is the default account)
    await eip20.approve(parameterizerAddress, 1000000)
    // challenger (accounts[1]) needs token funds to spend
    await eip20.transfer(accounts[1], 500000)
    // parameterizer must be approved to spend on [1]'s behalf
    await eip20.approve(parameterizerAddress, 450000, { from: accounts[1] })
    // voter needs funds
    await eip20.transfer(accounts[2], 500000)
    // approve voting by voter
    await eip20.approve(votingAddress, 450000, { from: accounts[2] })
  })

  it('should leave params intact if a proposal loses a challenge', async () => {
    const startingBalZero = await eip20.balanceOf(accounts[0]),
      startingBalOne = await eip20.balanceOf(accounts[1]),
      tx = await parameterizer.proposeReparameterization('voteQuorum', 51)

    expect(tx).toBeTruthy()

    // TODO abstract this into p11r class
    const propID = tx && tx.events && tx.events._ReparameterizationProposal.returnValues.propID

    const tx1 = await parameterizer.challengeReparameterization(propID, { from: accounts[1] })
    expect(tx1).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + ParameterDefaults.P_REVEAL_STAGE_LENGTH + 1)

    const tx2 = await parameterizer.processProposal(propID)
    expect(tx2).toBeTruthy()

    const voteQ = await parameterizer.get('voteQuorum')
    // nothing should have changed as it was challenged
    expect(voteQ).toBe('50')

    const finalBalZero = await eip20.balanceOf(accounts[0])
    // proposer loses their deposit
    expect(maybeParseInt(finalBalZero)).toBe(maybeParseInt(startingBalZero) - ParameterDefaults.P_MIN_DEPOSIT)

    // edge case, the challenger gets both deposits back b/c there were no voters
    const finalBalOne = await eip20.balanceOf(accounts[1])
    expect(maybeParseInt(finalBalOne)).toBe(maybeParseInt(startingBalOne) + ParameterDefaults.P_MIN_DEPOSIT)
  })

  it('should set new params if a proposal wins a challenge', async () => {
    const startingBalZero = await eip20.balanceOf(accounts[0]),
      startingBalOne = await eip20.balanceOf(accounts[1]),
      tx = await parameterizer.proposeReparameterization('voteQuorum', 51)
      // propID = eventReturnValue(tx, '_ReparameterizationProposal')

    expect(tx).toBeTruthy()
    const propID = tx && tx.events && tx.events._ReparameterizationProposal.returnValues.propID

    const tx1 = await parameterizer.challengeReparameterization(propID, { from: accounts[1] })
    expect(tx1).toBeTruthy()
    const challID = tx1 && tx1.events && tx1.events._NewChallenge.returnValues.challengeID

    // accounts[2] as voter here
    const tx2 = await commitVote(web3, voting, challID, accounts[2])
    expect(tx2).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)

    const tx3 = await voting.methods.revealVote(challID, 1, 420).send({ from: accounts[2] })
    expect(tx3).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.P_REVEAL_STAGE_LENGTH + 1)
    await parameterizer.processProposal(propID)

    const quorum = await parameterizer.get('voteQuorum')
    expect(quorum).toBe('51')
  })

})
