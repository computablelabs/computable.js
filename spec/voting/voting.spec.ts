import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types'
import Voting from '../../src/contracts/voting'
import Parameterizer from '../../src/contracts/parameterizer'
import Listing from '../../src/contracts/listing'
import {
  stringToBytes,
} from '../../src/helpers'

const provider:any = ganache.provider(),
  w3 = new Web3(provider)

let accounts:string[],
  voting:Voting,
  parameterizer:Parameterizer,
  listing:Listing

describe('Voting', () => {
  beforeAll(() => {

  })

  afterAll(() => {

  })

  beforeEach(async () => {
    accounts = await w3.eth.getAccounts()

    // erc20 = new Erc20(accounts[0])
    // voting = new Voting(accounts[0])
    // parameterizer = new Parameterizer(accounts[0])
    // listing = new Listing(accounts[0])

    // 0th account approves voting and reg to spend
    // await erc20.approve(web3, votingAddress, 1000000)
    // await erc20.approve(web3, registryAddress, 1000000)
    // 1st account, as challenger, needs funds
    // await erc20.transfer(web3, accounts[1], 500000)
    // 2nd account as voter needs funds
    // await erc20.transfer(web3, accounts[2], 500000)
    // registry needs to be approved to spend ond the challenger's behalf
    // await erc20.approve(web3, registryAddress, 450000, { from: accounts[1] })
    // voting needs approval from voter
    // await erc20.approve(web3, votingAddress, 450000, { from: accounts[2] })
  })

  it('can be instantiated from an existing deployment', async () => {
    // const address = voting.getAddress(),
      // other = new Voting(accounts[0]),
      // works = await other.at(web3, { address })

    // expect(works).toBe(true)
  })

  it('commits vote, updates state', async () => {
    // const domainOne = stringToBytes(web3, 'one.net'),
      // domainTwo = stringToBytes(web3, 'two.net'),
      // tx1 = await registry.apply(web3, domainOne, ParameterDefaults.MIN_DEPOSIT),
      // tx2 = await registry.apply(web3, domainTwo, ParameterDefaults.MIN_DEPOSIT)

  })

})
