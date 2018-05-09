import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import { ParameterDefaults, NAME } from '../../../src/constants'
import {
  commitVote,
  deployToken,
  deployDll,
  deployAttributeStore,
  deployVoting,
  deployParameterizer,
  deployRegistry,
} from '../../helpers'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Contract,
  dll:Contract,
  store:Contract,
  voting:Contract,
  parameterizer:Contract,
  registry:Contract

describe('PLCRVoting', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = await deployToken(web3, accounts[0])
    eip20.setProvider(provider)
    const tokenAddress = eip20.options.address

    dll = await deployDll(web3, accounts[0])
    dll.setProvider(provider)
    const dllAddress = dll.options.address

    store = await deployAttributeStore(web3, accounts[0])
    store.setProvider(provider)
    const storeAddress = store.options.address

    voting = await deployVoting(web3, accounts[0], dllAddress, storeAddress, tokenAddress)
    voting.setProvider(provider)
    const votingAddress = voting.options.address

    parameterizer = await deployParameterizer(web3, accounts[0], tokenAddress, votingAddress)
    parameterizer.setProvider(provider)
    const parameterizerAddress = parameterizer.options.address

    registry = await deployRegistry(
      web3, accounts[0], tokenAddress, votingAddress, parameterizerAddress, NAME
    )
    registry.setProvider(provider)
    const registryAddress = registry.options.address

    // 0th account approves voting and reg to spend
    await eip20.methods.approve(votingAddress, 1000000).send({ from: accounts[0] })
    await eip20.methods.approve(registryAddress, 1000000).send({ from: accounts[0] })
    // 1st account, as challenger, needs funds
    await eip20.methods.transfer(accounts[1], 500000).send({ from: accounts[0] })
    // 2nd account as voter needs funds
    await eip20.methods.transfer(accounts[2], 500000).send({ from: accounts[0] })
    // registry needs to be approved to spend ond the challenger's behalf
    await eip20.methods.approve(registryAddress, 450000).send({ from: accounts[1] })
    // voting needs approval from voter
    await eip20.methods.approve(votingAddress, 450000).send({ from: accounts[2] })
  })

  it('has deployed', () => {
    expect(voting).toBeTruthy()
    expect(voting.options.address).toBeTruthy()
  })

  it('commits vote, updates DLL state', async () => {

    const toBytes = (str:string) => web3.utils.toHex(str),
      domainOne = toBytes('one.net'),
      domainTwo = toBytes('two.net'),
      tx1 = await registry.methods.apply(domainOne, ParameterDefaults.MIN_DEPOSIT, '').send({ from: accounts[0] }),
      tx2 = await registry.methods.apply(domainTwo, ParameterDefaults.MIN_DEPOSIT, '').send({ from: accounts[0] })

    expect(tx1).toBeTruthy()
    expect(tx2).toBeTruthy()

    const tx3 = await registry.methods.challenge(domainOne, '').send({ from: accounts[1] })
    expect(tx3).toBeTruthy()
    const challID1 = tx3.events._Challenge.returnValues.challengeID
    expect(challID1).toBeTruthy()

    const tx4 = await registry.methods.challenge(domainTwo, '').send({ from: accounts[1] })
    expect(tx4).toBeTruthy()
    const challID2 = tx4.events._Challenge.returnValues.challengeID
    expect(challID2).toBeTruthy()

    // we'll let the defaults get used for vote, tokens and salt
    const tx5 = await commitVote(web3, voting, challID1, accounts[2])
    expect(tx5).toBeTruthy()
    // bump the num tokens here...
    const tx6 = await commitVote(web3, voting, challID2, accounts[2], undefined, 11)
    expect(tx6).toBeTruthy()
    // insert point for less than the default (10) should then be 0
    const pt = await voting.methods.getInsertPointForNumTokens(accounts[2], 9, challID1).call()
    expect(pt).toBe('0')
    // converse should be true for more...
    const pt2 = await voting.methods.getInsertPointForNumTokens(accounts[2], 12, challID2).call()
    expect(pt2).toBe('1')
  })

})
