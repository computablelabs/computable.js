import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types'
import MarketToken from '../../src/contracts/market-token'
import { MARKET_TOKEN_ABI, ONE_ETHER, ONE_GWEI } from  '../../src/constants'
import { Return } from '../../src/@types'
import {
  deploy,
  readBytecode,
  call,
  transact,
} from '../../src/helpers'

const provider:any = ganache.provider(),
  w3 = new Web3(provider),
  toBN = w3.utils.toBN,
  reserveAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b',
  listingAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b'

let token:MarketToken,
  accounts:string[],
  deployed:Contract

describe('Market Token', () => {
  beforeAll(async () => {
    accounts = await w3.eth.getAccounts()

    // deploy it...
    const bin:string = readBytecode('markettoken')

    deployed = await deploy(w3, accounts[0], MARKET_TOKEN_ABI,
      bin, [accounts[0], ONE_ETHER])

    // now we can instantiate the HOC
    token = new MarketToken(accounts[0])
    await token.at(w3, deployed.options.address)
  })

  describe('Class methods for Market Token', () => {

    it('calls setPrivileged correctly', async () => {
      const defaults = await token.setPrivileged(reserveAddress, listingAddress)
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = token.getGas('setPrivileged')
      expect(tx).not.toBeNull(accounts[0])
      expect(opts).not.toBeNull()
      expect(Object.keys(opts).indexOf('gas')).toBeGreaterThan(-1)
      expect(Object.keys(opts).indexOf('from')).toBeGreaterThan(-1)
      expect(Object.keys(opts).indexOf('gasPrice')).toBeGreaterThan(-1)
      expect(opts['gas']).toBeGreaterThanOrEqual(gas)
      let from = opts['from']
      expect(from).not.toBeNull()
      expect(from!.trim().length).toBeGreaterThan(0)
      let gasPrice = opts['gasPrice']
      expect(gasPrice).not.toBeNull()
      expect(parseInt(gasPrice)).toBeGreaterThan(0)
    })

    it('calls getPrivileged correctly', async () => {
      const defaults = await token.getPrivileged()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = token.getGas('getPrivileged')
      expect(tx).not.toBeNull(accounts[0])
      expect(opts).not.toBeNull()
      expect(Object.keys(opts).indexOf('gas')).toBeGreaterThan(-1)
      expect(Object.keys(opts).indexOf('from')).toBeGreaterThan(-1)
      expect(Object.keys(opts).indexOf('gasPrice')).toBeGreaterThan(-1)
      expect(opts['gas']).toBeGreaterThanOrEqual(gas)
      let from = opts['from']
      expect(from).not.toBeNull()
      expect(from!.trim().length).toBeGreaterThan(0)
      let gasPrice = opts['gasPrice']
      expect(gasPrice).not.toBeNull()
      expect(parseInt(gasPrice)).toBeGreaterThan(0)
    })

    it('calls hasPrivilege correctly', async () => {
      const defaults = await token.hasPrivilege('addr')
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = token.getGas('hasPrivilege')
      expect(tx).not.toBeNull(accounts[0])
      expect(opts).not.toBeNull()
      expect(Object.keys(opts).indexOf('gas')).toBeGreaterThan(-1)
      expect(Object.keys(opts).indexOf('from')).toBeGreaterThan(-1)
      expect(Object.keys(opts).indexOf('gasPrice')).toBeGreaterThan(-1)
      expect(opts['gas']).toBeGreaterThanOrEqual(gas)
      let from = opts['from']
      expect(from).not.toBeNull()
      expect(from!.trim().length).toBeGreaterThan(0)
      let gasPrice = opts['gasPrice']
      expect(gasPrice).not.toBeNull()
      expect(parseInt(gasPrice)).toBeGreaterThan(0)
    })
  })
})
