import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import Parameterizer from '../../src/contracts/parameterizer'
import { maybeParseInt } from '../../src/helpers'

const provider:any = ganache.provider(),
  w3 = new Web3(provider)

let accounts:string[],
  parameterizer:Parameterizer

describe('Parameterizer', () => {
  beforeAll(() => {

  })

  afterAll(() => {

  })

  beforeEach(async () => {
    accounts = await w3.eth.getAccounts()

    // parameterizer = new Parameterizer(accounts[0])
  })


  it('has been instantiated from an existing deployment', async () => {

  })
})
