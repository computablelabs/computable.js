import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Addresses, Token } from '../../../src/constants'
import Parameterizer from '../../../src/contracts/parameterizer'
import { maybeParseInt } from '../../../src/helpers'

// TODO use the web3 IProvider?
const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  parameterizer:Parameterizer

describe('Parameterizer', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    parameterizer = new Parameterizer(accounts[0])
    const parameterizerAddress = await parameterizer.deploy(web3, {
      tokenAddress: Addresses.TWO,
      votingAddress: Addresses.THREE
    })

    parameterizer.setProvider(provider)
  })

  it('can be instantiated (with that ridiculous amount of args...)', () => {
    expect(parameterizer).toBeTruthy()
  })

  it('has a functioning get method', async () => {
    const minD = await parameterizer.get('minDeposit')
    expect(maybeParseInt(minD)).toBe(10)
  })
})
