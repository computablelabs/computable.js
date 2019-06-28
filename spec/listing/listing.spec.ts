import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types'
import Voting from '../../src/contracts/voting'
import Parameterizer from '../../src/contracts/parameterizer'
import Listing from '../../src/contracts/listing'

const provider:any = ganache.provider(),
  w3 = new Web3(provider)

let accounts:string[],
  voting:Voting,
  parameterizer:Parameterizer,
  listing:Listing

describe('Listing', () => {
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
  })

  it('has deployed, setting correct state', async () => {
    // expect(registry).toBeTruthy()
    // expect(registry.getAddress).toBeTruthy()

    // const regToken = await registry.token()
    // expect(regToken).toBe(erc20.getAddress())

    // const regParam = await registry.parameterizer()
    // expect(regParam).toBe(parameterizer.getAddress())

    // const regVote = await registry.voting()
    // expect(regVote).toBe(voting.getAddress())

    // const name = await registry.name()
    // expect(name).toBe(NAME)
  })
})
