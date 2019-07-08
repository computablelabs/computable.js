import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types'
import Listing from '../../src/contracts/listing'
import { LISTING_ABI, ONE_ETHER, ONE_GWEI } from  '../../src/constants'
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

let listing:Listing,
  accounts:string[],
  deployed:Contract

describe('Listing', () => {
  beforeAll(async () => {
    accounts = await w3.eth.getAccounts()

    // deploy it...
    const bin:string = readBytecode('voting')

    deployed = await deploy(w3,
                            accounts[0],
                            LISTING_ABI,
                            bin,
                            [marketTokenAddress,
                              votingAddress,
                              p11rAddress,
                              reserveAddress,
                              datatrustAddress])

    // now we can instantiate the HOC
    listing = new Listing(accounts[0])
    await listing.at(w3, deployed.options.address)
  })

  describe('Class methods for Listing', () => {

    it('calls isListed correctly', async () => {
      const defaults = await listing.isListed("listing", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = listing.getGas('isListed')
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

    it('calls withdrawFromListing correctly', async () => {
      const defaults = await listing.withdrawFromListing("listing", "1000", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = listing.getGas('withdrawFromListing')
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

    it('calls list correctly', async () => {
      const defaults = await listing.list("listing", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = listing.getGas('list')
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

    it('calls getListing correctly', async () => {
      const defaults = await listing.getListing("listing", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = listing.getGas('getListing')
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

    // no longer exists in ABI
    // it('calls removeApplication correctly', async () => {
    //   const defaults = await listing.removeApplication("listing", {})
    //   let tx = defaults[0]
    //   let opts = defaults[1]
    //   expect(tx).not.toBeNull(accounts[0])
    //   expect(opts).not.toBeNull()
    //   expect(Object.keys(opts).indexOf('gas')).toBeGreaterThan(-1)
    //   expect(Object.keys(opts).indexOf('from')).toBeGreaterThan(-1)
    //   expect(Object.keys(opts).indexOf('gasPrice')).toBeGreaterThan(-1)
    //   expect(opts['gas']).toBeGreaterThanOrEqual(101191)
    //   let from = opts['from']
    //   expect(from).not.toBeNull()
    //   expect(from!.trim().length).toBeGreaterThan(0)
    //   let gasPrice = opts['gasPrice']
    //   expect(gasPrice).not.toBeNull()
    //   expect(parseInt(gasPrice)).toBeGreaterThan(0)
    // })

    it('calls claimBytesAccessed correctly', async () => {
      const defaults = await listing.claimBytesAccessed("listing", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = listing.getGas('claimBytesAccessed')
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

    it('calls challenge correctly', async () => {
      const defaults = await listing.challenge("listing",{})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = listing.getGas('challenge')
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

    it('calls resolveChallenge correctly', async () => {
      const defaults = await listing.resolveChallenge("listing",{})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = listing.getGas('resolveChallenge')
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

    it('calls exit correctly', async () => {
      const defaults = await listing.exit("listing", {})
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = listing.getGas('exit')
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
