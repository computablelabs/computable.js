import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types'
import Reserve from '../../src/contracts/reserve'
import { RESERVE_ABI, ONE_ETHER, ONE_GWEI } from  '../../src/constants'
import { Return } from '../../src/@types'
import {
  deploy,
  readBytecode,
  call,
  transact,
} from '../../src/helpers'

const provider:any = ganache.provider(),
  w3 = new Web3(provider, undefined, {defaultBlock: 'latest',
    transactionConfirmationBlocks: 1, transactionBlockTimeout: 5}),
    toBN = w3.utils.toBN

const marketTokenAddress = "0x931D387731bBbC988B312206c74F77D004D6B84b"
const votingAddress = "0x931D387731bBbC988B312206c74F77D004D6B84b"
const p11rAddress = "0x931D387731bBbC988B312206c74F77D004D6B84b"

let reserve:Reserve,
  accounts:string[],
  deployed:Contract

describe('Reserve', () => {
  beforeAll(async () => {
    accounts = await w3.eth.getAccounts()

    // deploy it...
    const bin:string = readBytecode('reserve')

    deployed = await deploy(w3,
                            accounts[0],
                            RESERVE_ABI,
                            bin,
                            [marketTokenAddress,
                              votingAddress,
                              p11rAddress])

    // now we can instantiate the HOC
    reserve = new Reserve(accounts[0])
    await reserve.at(w3, deployed.options.address)
  })

  describe('Class methods for Reserve', () => {

    it('calls getSupportPrice correctly', async () => {
      const defaults = await reserve.getSupportPrice({})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = reserve.getGas('getSupportPrice')
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

    it('calls support correctly', async () => {
      const defaults = await reserve.support("datatrust", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = reserve.getGas('support')
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

    it('calls getWithdrawalProceeds correctly', async () => {
      const defaults = await reserve.getWithdrawalProceeds("address", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = reserve.getGas('getWithdrawalProceeds')
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

    it('calls withdraw correctly', async () => {
      const defaults = await reserve.withdraw()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = reserve.getGas('withdraw')
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