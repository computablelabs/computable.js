import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types.d'
import { ParameterDefaults, NAME } from '../../../src/constants'
import { onData, deployDll, deployAttributeStore } from '../../../src/helpers'
import { stringToBytes } from '../../helpers'
import Erc20 from '../../../src/contracts/erc-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'

let web3:Web3,
  server:any,
  provider:any,
  accounts:string[],
  erc20:Erc20,
  dll:Contract,
  store:Contract,
  voting:Voting,
  parameterizer:Parameterizer,
  registry:Registry

beforeAll(() => {
  server = ganache.server({ws:true})
  server.listen(8553)

  provider = new Web3.providers.WebsocketProvider('ws://localhost:8553')
  web3 = new Web3(provider)
})

afterAll(() => {
  server.close()
  server = null
})

describe('PLCRVoting', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    erc20 = new Erc20(accounts[0])
    const tokenAddress = await erc20.deploy(web3)
    erc20.setProvider(provider)

    dll = await deployDll(web3, accounts[0])
    dll.setProvider(provider)
    const dllAddress = dll.options.address

    store = await deployAttributeStore(web3, accounts[0])
    store.setProvider(provider)
    const attributeStoreAddress = store.options.address

    voting = new Voting(accounts[0])
    const votingAddress = await voting.deploy(web3, { tokenAddress, dllAddress, attributeStoreAddress })
    voting.setProvider(provider)

    parameterizer = new Parameterizer(accounts[0])
    const parameterizerAddress = await parameterizer.deploy(web3, { tokenAddress, votingAddress })
    parameterizer.setProvider(provider)

    registry = new Registry(accounts[0])
    const registryAddress = await registry.deploy(web3, { tokenAddress, votingAddress, parameterizerAddress, name: NAME })
    registry.setProvider(provider)

    // 0th account approves voting and reg to spend
    await erc20.approve(votingAddress, 1000000)
    await erc20.approve(registryAddress, 1000000)
    // 1st account, as challenger, needs funds
    await erc20.transfer(accounts[1], 500000)
    // 2nd account as voter needs funds
    await erc20.transfer(accounts[2], 500000)
    // registry needs to be approved to spend ond the challenger's behalf
    await erc20.approve(registryAddress, 450000, { from: accounts[1] })
    // voting needs approval from voter
    await erc20.approve(votingAddress, 450000, { from: accounts[2] })
  })

  it('has deployed', () => {
    expect(voting).toBeTruthy()
    expect(voting.getAddress()).toBeTruthy()
  })

  it('commits vote, updates DLL state', async () => {
    const domainOne = stringToBytes(web3, 'one.net'),
      domainTwo = stringToBytes(web3, 'two.net'),
      tx1 = await registry.apply(domainOne, ParameterDefaults.MIN_DEPOSIT),
      tx2 = await registry.apply(domainTwo, ParameterDefaults.MIN_DEPOSIT)

    expect(tx1).toBeTruthy()
    expect(tx2).toBeTruthy()

    const emitter = registry.getEventEmitter('_Challenge')

    registry.challenge(domainOne, '', { from: accounts[1] })

    const log1 = await onData(emitter), challID1 = log1.returnValues.challengeID
    expect(challID1).toBeTruthy()

    registry.challenge(domainTwo, '', { from: accounts[1] })

    const log2 = await onData(emitter), challID2 = log2.returnValues.challengeID
    expect(challID2).toBeTruthy()

    // args: last 3 are vote, tokens, salt
    const tx5 = await voting.commitVote(web3, challID1, accounts[2], 1, 10, 420)
    expect(tx5).toBeTruthy()
    // bump the num tokens here...
    const tx6 = await voting.commitVote(web3, challID2, accounts[2], 1, 11, 420)
    expect(tx6).toBeTruthy()
    // insert point for less than the default (10) should then be 0
    const pt = await voting.getInsertPointForNumTokens(accounts[2], 9, challID1)
    expect(pt).toBe('0')
    // converse should be true for more...
    const pt2 = await voting.getInsertPointForNumTokens(accounts[2], 12, challID2)
    expect(pt2).toBe('1')
  })

})
