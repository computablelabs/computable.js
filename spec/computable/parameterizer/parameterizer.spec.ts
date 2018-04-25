import * as ganache from 'ganache-cli'
import Web3 from 'web3'
// symlink? copy types to @types? TODO
import { Contract } from '../../../node_modules/web3/types.d'
import pJson from '../../../computable/build/contracts/Parameterizer.json'
import tJson from '../../../computable/build/contracts/EIP20.json'
import { getDefaults } from './helpers'
import { Addresses, Token } from '../../../src/constants'

// TODO use the web3 IProvider?
const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Contract,
  parameterizer:Contract

describe('Parameterizer', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = await new web3.eth.Contract(tJson.abi)
      .deploy({ data: tJson.bytecode, arguments: [
        Token.supply,
        Token.name,
        Token.decimals,
        Token.symbol
      ]})
      .send({ from: accounts[0], gas: '5000000' }) // NOTE watch the gas limit here

    eip20.setProvider(provider)
    const tokenAddress = eip20.options.address

    parameterizer = await new web3.eth.Contract(pJson.abi)
      .deploy({ data: pJson.bytecode, arguments: [
        tokenAddress,
        Addresses.Three, // TODO use deployed voting contract
        ...getDefaults()
      ]})
      .send({ from: accounts[0], gas: '5000000' }) // NOTE watch the gas limit here

    parameterizer.setProvider(provider)
  })

  // describe('Expected failures', () => {
    // it('throws if called by non-owner', async () => {
      // try {
        // await validator.methods.addVote('foo').send({
          // from: accounts[1],
        // })

        // // this should never be run as we should throw above
        // expect(false).toBe(true)

      // } catch(e) {
        // expect(e).toBeTruthy()
      // }
    // })
  // })

  it('can be instantiated (with that ridiculous amount of args...)', () => {
    expect(parameterizer).toBeTruthy()
  })

  it('has a functioning get method', async () => {
    const minD = await parameterizer.methods.get('minDeposit').call()
    expect(parseInt(minD)).toBe(10)
  })

  xit('fetches a proposal by an id', async () => {
    const pid = await parameterizer.methods.proposeReparameterization('voteQuorum', 51).send({ from: accounts[0] })
    expect(pid).toBeTruthy()
  })
})
