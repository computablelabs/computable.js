import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types'
import Datatrust from '../../src/contracts/datatrust'
import { DATATRUST_ABI, ONE_ETHER, ONE_GWEI } from  '../../src/constants'
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

const marketTokenAddress = "markettoken"
const votingAddress = "voting"
const p11rAddress = "p11r"
const reserveAddress = "reserve"
const datatrustAddress = "datatrust"

let datatrust:Datatrust,
  accounts:string[],
  deployed:Contract

describe('Datatrust', () => {
  beforeAll(async () => {
    accounts = await w3.eth.getAccounts()

    // deploy it...
    const bin:string = readBytecode('voting')

    deployed = await deploy(w3,
                            accounts[0],
                            DATATRUST_ABI,
                            bin,
                            [marketTokenAddress,
                              votingAddress,
                              p11rAddress,
                              reserveAddress])

    // now we can instantiate the HOC
    datatrust = new Datatrust(accounts[0])
    await datatrust.at(w3, deployed.options.address)
  })

  describe('Class methods for Datatrust', () => {

    it('calls setPrivileged correctly', async () => {
      const defaults = await datatrust.setPrivileged("datatrust", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('setPrivileged')
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
      const defaults = await datatrust.getPrivileged({})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('getPrivileged')
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

    it('calls getHash correctly', async () => {
      const defaults = await datatrust.getHash("datatrust", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('getHash')
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

    it('calls getBackendAddress correctly', async () => {
      const defaults = await datatrust.getBackendAddress({})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('getBackendAddress')
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

    it('calls getBackendUrl correctly', async () => {
      const defaults = await datatrust.getBackendUrl({})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('getBackendUrl')
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

    it('calls setBackendUrl correctly', async () => {
      const defaults = await datatrust.setBackendUrl("datatrust", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('setBackendUrl')
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

    it('calls setDataHash correctly', async () => {
      const defaults = await datatrust.setDataHash("datatrust", "data", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('setDataHash')
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

    it('calls register correctly', async () => {
      const defaults = await datatrust.register("datatrust",{})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('register')
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

    it('calls resolveRegistration correctly', async () => {
      const defaults = await datatrust.resolveRegistration("datatrust", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('resolveRegistration')
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

    it('calls requestDelivery correctly', async () => {
      const defaults = await datatrust.requestDelivery("datatrust", "1000", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('requestDelivery')
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

    it('calls getBytesPurchased correctly', async () => {
      const defaults = await datatrust.getBytesPurchased("datatrust", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('getBytesPurchased')
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

    it('calls getDelivery correctly', async () => {
      const defaults = await datatrust.getDelivery("datatrust", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('getDelivery')
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

    it('calls listingAccessed correctly', async () => {
      const defaults = await datatrust.listingAccessed("datatrust", "delivery", "100000", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('listingAccessed')
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

    it('calls getBytesAccessed correctly', async () => {
      const defaults = await datatrust.getBytesAccessed("datatrust", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('getBytesAccessed')
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

    it('calls delivered correctly', async () => {
      const defaults = await datatrust.delivered("datatrust", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = datatrust.getGas('delivered')
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