import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types'
import EtherToken from '../../src/contracts/ether-token'
import MarketToken from '../../src/contracts/market-token'
import Voting from '../../src/contracts/voting'
import Parameterizer from '../../src/contracts/parameterizer'
import Reserve from '../../src/contracts/reserve'
import { ETHER_TOKEN_ABI, MARKET_TOKEN_ABI, VOTING_ABI, PARAMETERIZER_ABI, RESERVE_ABI, ONE_ETHER, ONE_GWEI } from  '../../src/constants'
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
  etherTokenAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b',
  marketTokenAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b',
  votingAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b',
  datatrustAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b',
  listingAddress = '0x931D387731bBbC988B312206c74F77D004D6B84b'

const priceFloor = w3.utils.toWei('1', 'szabo')
const spread = 110
const listReward = w3.utils.toWei('250', 'szabo')
const stake = w3.utils.toWei('10', 'finney')
const voteBy = 100
const plurality = 50
const backendPayment = 25
const makerPayment = 25
const costPerByte = w3.utils.toWei('100', 'gwei')

let etherToken:EtherToken,
  marketToken:MarketToken,
  voting:Voting,
  parameterizer:Parameterizer,
  reserve:Reserve,
  accounts:string[],
  instantiated:boolean,
  deployedEtherToken:Contract,
  deployedMarketToken:Contract,
  deployedVoting:Contract,
  deployedParameterizer:Contract,
  deployedReserve:Contract

describe('Parameterizer', () => {
  beforeAll(async () => {
    accounts = await w3.eth.getAccounts()

    //// deploy ether token
    //const etherTokenBin:string = readBytecode('ethertoken')
    //deployedEtherToken = await deploy(w3, accounts[0], ETHER_TOKEN_ABI,
    //  etherTokenBin, [])
    //// now instantiate EtherToken HOC 
    //etherToken = new EtherToken(accounts[0])
    //instantiated = await etherToken.at(w3, deployedEtherToken.options.address)

    //// deploy market token
    //const marketTokenBin:string = readBytecode('markettoken')
    //deployedMarketToken = await deploy(w3, accounts[0], MARKET_TOKEN_ABI,
    //  marketTokenBin, [accounts[0], ONE_GWEI])
    //// now instantiate MarketToken HOC 
    //marketToken = new MarketToken(accounts[0])
    //instantiated = await marketToken.at(w3, deployedMarketToken.options.address)

    //// deploy voting 
    //const votingBin:string = readBytecode('voting')
    //deployedVoting = await deploy(w3, accounts[0], VOTING_ABI,
    //  votingBin, [deployedMarketToken.options.address])
    //// now instantiate Voting HOC 
    //voting = new Voting(accounts[0])
    //instantiated = await voting.at(w3, deployedVoting.options.address)

    // deploy Parameterizer
    const parameterizerBin:string = readBytecode('parameterizer')
    deployedParameterizer = await deploy(w3,
                            accounts[0],
                            PARAMETERIZER_ABI,
                            parameterizerBin,
                            [marketTokenAddress,
                              votingAddress,
                              priceFloor,
                              spread,
                              listReward,
                              stake,
                              voteBy,
                              plurality,
                              backendPayment,
                              makerPayment,
                              costPerByte])
    // now we can instantiate the HOC
    parameterizer = new Parameterizer(accounts[0])
    await parameterizer.at(w3, deployedParameterizer.options.address)

    //// deploy reserve 
    //const reserveBin:string = readBytecode('reserve')
    //deployedReserve = await deploy(w3, accounts[0], RESERVE_ABI,
    //  reserveBin, [deployedEtherToken.options.address,
    //               deployedMarketToken.options.address,
    //               deployedParameterizer.options.address])
    //// now instantiate Reserve HOC 
    //reserve = new Reserve(accounts[0])
    //instantiated = await reserve.at(w3, deployedReserve.options.address)
    //
    //// MarketToken Set Privileged
    //await transact(await marketToken.setPrivileged(deployedReserve.options.address, listingAddress))
    //// Voting Set Privileged
    //await transact(await voting.setPrivileged(deployedParameterizer.options.address, datatrustAddress, listingAddress))
  })

  describe('Class methods for Parameterizer', () => {

    it('calls getBackendPayment correctly', async () => {
      const defaults = await parameterizer.getBackendPayment()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getBackendPayment')
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

    it('calls getMakerPayment correctly', async () => {
      const defaults = await parameterizer.getMakerPayment()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getMakerPayment')
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

    it('calls getReservePayment correctly', async () => {
      const defaults = await parameterizer.getReservePayment()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getReservePayment')
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

    it('calls getCostPerByte correctly', async () => {
      const defaults = await parameterizer.getCostPerByte()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getCostPerByte')
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
      const defaults = await parameterizer.getStake()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getStake')
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

    it('calls getPriceFloor correctly', async () => {
      const defaults = await parameterizer.getPriceFloor()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getPriceFloor')
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
      const defaults = await parameterizer.getHash(2, 42)
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getHash')
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

    it('calls getSpread correctly', async () => {
      const defaults = await parameterizer.getSpread()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getSpread')
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

    it('calls getListReward correctly', async () => {
      const defaults = await parameterizer.getListReward()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getListReward')
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

    it('calls getPlurality correctly', async () => {
      const defaults = await parameterizer.getPlurality()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getPlurality')
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

    it('calls getReparam correctly', async () => {
      const defaults = await parameterizer.getReparam('hash')
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getReparam')
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

    it('calls getVoteBy correctly', async () => {
      const defaults = await parameterizer.getVoteBy()
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('getVoteBy')
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

    it('calls reparameterize correctly', async () => {
      //// Deposit into ether token
      //const origBal = toBN(await call(await etherToken.balanceOf(accounts[0])))
      //expect(origBal.toString()).toBe('0')
      //await transact(await etherToken.deposit(ONE_ETHER, {from: accounts[0]}))
      //const newBal = toBN(await call(await etherToken.balanceOf(accounts[0])))
      //expect(newBal.toString()).toBe(ONE_ETHER)

      //// Grant ethertoken allowance to reserve
      //const oldAllowance = toBN(await call(await etherToken.allowance(accounts[0], deployedReserve.options.address)))
      //expect(oldAllowance.toString()).toBe('0')
      //await transact(await etherToken.approve(deployedReserve.options.address, ONE_ETHER))
      //const newAllowance = toBN(await call(await etherToken.allowance(accounts[0], deployedReserve.options.address)))
      //expect(newAllowance.toString()).toBe(ONE_ETHER)

      //// Call support
      //await transact(await reserve.support(ONE_ETHER))
      //// Approve the market token allowance
      //const oldMktAllowance = await call(await marketToken.allowance(accounts[0], deployedVoting.options.address))
      //expect(oldMktAllowance.toString()).toBe('0')
      //await transact(await marketToken.approve(deployedVoting.options.address, ONE_ETHER))
      //const newMktAllowance = await call(await marketToken.allowance(accounts[0], deployedVoting.options.address))
      //expect(newMktAllowance.toString()).toBe(ONE_ETHER)

      // PLURALITY == 6
      const defaults = await parameterizer.reparameterize(6, 51)
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('reparameterize')
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

      // Now call the actual transaction
      //await transact(await parameterizer.reparameterize(6, 51, {gas: 5000000}))
    })

    it('calls resolveReparam correctly', async () => {
      const defaults = await parameterizer.resolveReparam('hash')
      let tx = defaults[0]
      let opts = defaults[1]
      let gas = parameterizer.getGas('resolveReparam')
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
