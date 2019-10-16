import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types'
import EtherToken from '../src/contracts/ether-token'
import { ETHER_TOKEN_ABI, ONE_ETHER, ONE_GWEI } from  '../src/constants'
import { Return } from '../src/@types'
import {
  deploy,
  readBytecode,
  call,
  transact,
} from '../src/helpers'

const provider:any = ganache.provider(),
  w3 = new Web3(provider),
    toBN = w3.utils.toBN

// we'll use the ether token contract to test the deployed base methods here (could be any contract)
let base:EtherToken,
  accounts:string[],
  deployed:Contract

describe('Deployed Base Class', () => {
  beforeAll(async () => {
    accounts = await w3.eth.getAccounts()

    // deploy it...
    const bin:string = readBytecode('ethertoken')

    deployed = await deploy(w3, accounts[0], ETHER_TOKEN_ABI,
      bin, [])

    // now we can instantiate the HOC
    base = new EtherToken(accounts[0])
    await base.at(w3, deployed.options.address)
  })

  describe('Super class methods for all HOCs', () => {
    it('assigns defaults to an empty object', () => {
      const defaults = base.assignTransactOpts({})
      expect(defaults.from).toBe(accounts[0])
      expect(defaults.gasPrice).toBeTruthy()
    })

    it('will use passed in values when assigning transact opts', () => {
      // see github.com/indutny/bn.js for all available BN methods
      let oneGwei = toBN(ONE_GWEI)
      const defaults = base.assignTransactOpts({value: oneGwei.mul(toBN(3)).toString()})
      expect(defaults.from).toBe(accounts[0])
      expect(defaults.value).toBe(oneGwei.mul(toBN(3)).toString())
    })

    it('will overwrite from the opts', () => {
      const defaults = base.assignTransactOpts({to: '0xfoo'}, {to: '0xbar'})
      expect(defaults.to).toBe('0xbar')
    })
  })
})
