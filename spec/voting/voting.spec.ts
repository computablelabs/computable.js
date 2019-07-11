import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types'
import Voting from '../../src/contracts/voting'
import { VOTING_ABI, ONE_ETHER, ONE_GWEI } from  '../../src/constants'
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
  marketTokenAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b',
  p11rAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b',
  reserveAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b',
  datatrustAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b',
  listingAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b'

let voting:Voting,
  accounts:string[],
  deployed:Contract

describe('Voting', () => {
  beforeAll(async () => {
    accounts = await w3.eth.getAccounts()

    // deploy it...
    const bin:string = readBytecode('voting')

    deployed = await deploy(w3,
                            accounts[0],
                            VOTING_ABI,
                            bin,
                            [marketTokenAddress])

    // now we can instantiate the HOC
    voting = new Voting(accounts[0])
    await voting.at(w3, deployed.options.address)
  })

  describe('Class methods for Voting', () => {

    it('exists', () => {
      expect(deployed).toBeTruthy()
    })

    it('calls setPrivileged correctly', async () => {
      const defaults = await voting.setPrivileged(p11rAddress, reserveAddress,
        datatrustAddress, listingAddress)
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('setPrivileged')
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
      const defaults = await voting.getPrivileged()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('getPrivileged')
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
      const defaults = await voting.hasPrivilege('addr')
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('hasPrivilege')
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

    it('calls candidateIs correctly', async () => {
      const defaults = await voting.candidateIs('hash', 'kind')
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('candidateIs')
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

    it('calls isCandidate correctly', async () => {
      const defaults = await voting.isCandidate('hash')
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('isCandidate')
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

    it('calls getCandidate correctly', async () => {
      const defaults = await voting.getCandidate('hash')
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('getCandidate')
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

    it('calls getCandidateOwner correctly', async () => {
      const defaults = await voting.getCandidateOwner('hash')
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('getCandidateOwner')
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

    it('calls didPass correctly', async () => {
      const defaults = await voting.didPass('hash', 50)
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('didPass')
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

    it('calls vote correctly', async () => {
      const defaults = await voting.vote('hash', 1)
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('vote')
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

    it('calls getStake correctly', async () => {
      const defaults = await voting.getStake('somehash', 'someaddress')
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('getStake')
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

    it('calls unstake correctly', async () => {
      const defaults = await voting.unstake('hash')
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = voting.getGas('unstake')
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
