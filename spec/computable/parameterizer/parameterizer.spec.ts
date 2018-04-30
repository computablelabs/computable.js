import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { deployParameterizer } from '../helpers'
import { Contract } from '../../../node_modules/web3/types.d'
import { Addresses, Token } from '../../../src/constants'

// TODO use the web3 IProvider?
const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  parameterizer:Contract

describe('Parameterizer', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

  parameterizer = await deployParameterizer(web3, accounts[0], Token.address, Addresses.THREE) // THREE placeholding plcr TODO
  })

  it('can be instantiated (with that ridiculous amount of args...)', () => {
    expect(parameterizer).toBeTruthy()
  })

  it('has a functioning get method', async () => {
    const minD = await parameterizer.methods.get('minDeposit').call()
    expect(parseInt(minD)).toBe(10)
  })
})
