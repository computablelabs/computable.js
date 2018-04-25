import * as ganache from 'ganache-cli'
import Web3 from 'web3'
// symlink? copy types to @types? TODO
import { Contract } from '../../../node_modules/web3/types.d'
import json from '../../../computable/build/contracts/Parameterizer.json'
import { getDefaults } from './helpers'
import { Addresses, Token } from '../../../src/constants'

// TODO use the web3 IProvider?
const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  parameterizer:Contract

describe('Parameterizer', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    parameterizer = await new web3.eth.Contract(json.abi)
      .deploy({ data: json.bytecode, arguments: [
        Token.address,
        Addresses.Three, // TODO use deployed voting contract
        ...getDefaults()
      ]})
      .send({ from: accounts[0], gasPrice: 100, gas: 4500000 })

    parameterizer.setProvider(provider)
  })

  it('can be instantiated (with that ridiculous amount of args...)', () => {
    expect(parameterizer).toBeTruthy()
  })

  it('has a functioning get method', async () => {
    const minD = await parameterizer.methods.get('minDeposit').call()
    expect(parseInt(minD)).toBe(10)
  })
})
