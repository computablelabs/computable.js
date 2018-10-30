import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract, Block } from 'web3/types'
import { BigNumber } from 'bignumber.js'
import Erc20 from '../../../src/contracts/erc-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'
import { ParameterDefaults, NAME } from '../../../src/constants'
import {
  deployDll,
  deployAttributeStore,
  maybeParseInt,
  eventsReturnValues,
  pastEventsReturnValues,
  stringToBytes,
  increaseTime,
} from '../../../src/helpers'

// define users and private keys so we can test signed transactions as well
const users = [{
    secretKey: '0x71cc6e70f524061c36f6b9091889785f6e777d489267334bbef1c129cb7d0d69',
    balance: 1000000000000000000, // 1 ETH in wei
  }, {
    secretKey: '0x81cc6e70f524061c36f6b9091889785f6e777d489267334bbef1c129cb7d0d70',
    balance: 1000000000000000000,
  }]

const provider:any = ganache.provider({ accounts: users }),
  web3 = new Web3(provider)

let accounts:string[],
  erc20:Erc20,
  dll:Contract,
  store:Contract,
  voting:Voting,
  parameterizer:Parameterizer,
  registry:Registry

describe('Registry: Apply', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    erc20 = new Erc20(accounts[0])
    const tokenAddress = await erc20.deploy(web3)
    erc20.setProvider(provider)

    dll = await deployDll(web3, accounts[0])
    dll.setProvider(provider)
    const dllAddress = dll.options.address

    store = await deployAttributeStore(web3, accounts[0])
    store.setProvider(provider)
    const attributeStoreAddress = store.options.address

    voting = new Voting(accounts[0])
    const votingAddress = await voting.deploy(web3, { tokenAddress, dllAddress, attributeStoreAddress })
    voting.setProvider(provider)

    parameterizer = new Parameterizer(accounts[0])
    const parameterizerAddress = await parameterizer.deploy(web3, { tokenAddress, votingAddress })
    parameterizer.setProvider(provider)

    registry = new Registry(accounts[0])
    const registryAddress = await registry.deploy(web3, { tokenAddress, votingAddress, parameterizerAddress, name: NAME })
    registry.setProvider(provider)

    // 0th account approves voting and reg to spend
    await erc20.approve(web3, votingAddress, 1000000)
    await erc20.approve(web3, registryAddress, 1000000)

    // 1st account needs funding
    await erc20.transfer(web3, accounts[1], 500000)
    await erc20.approve(web3, registryAddress, 250000, { from: accounts[1] })
    await erc20.approve(web3, parameterizerAddress, 250000, { from: accounts[1] })
  })

  it('allows a new application', async () => {
    const listBytes = stringToBytes(web3, 'listing.com'),
      // use a signed transacion, get estimates for gas && price
      price = await web3.eth.getGasPrice(),
      gas = await registry.apply(web3, listBytes, ParameterDefaults.MIN_DEPOSIT, '', { estimateGas: true }), // NOTE you only need send the args the bytecode method expects
      // we have to make the secret keys actual secret keys and not the faux-hexed ones above... real use cases won't need to substr...
      tx1 = await registry.apply(web3, listBytes, ParameterDefaults.MIN_DEPOSIT, undefined, {gas: gas, gasPrice: price, sign: users[0].secretKey.substr(2)}),
      // grab the block number so we can grab the events that happened
      block = tx1.blockNumber

    expect(block).toBeTruthy()

    // use eventsReturnValues with getPastEvents to act about the same as an event listener. Why?
    // for some reason web 3 does not return events with signed transactions...
    const listingHash = pastEventsReturnValues(await registry.getPastEvents('_Application', {fromBlock: block}),
      'listingHash')[0] // returns an array

    expect(listingHash).toBeTruthy() // it pads it out with zeroes so not an exact match

    const listing = await registry.listings(listBytes)
    expect(listing).toBeTruthy()
    expect(maybeParseInt(listing.applicationExpiry)).toBeGreaterThan(0)
    expect(listing.whitelisted).toBe(false)
    expect(listing.owner).toBe(accounts[0])
    expect(maybeParseInt(listing.unstakedDeposit)).toBe(ParameterDefaults.MIN_DEPOSIT)
  })

  it('does not allow a listing to apply if already pending', async () => {
    const listBytes = stringToBytes(web3, 'another.com')

    // we should not have an application yet
    expect(await registry.appWasMade(listBytes)).toBe(false)

    const tx1 = await registry.apply(web3, listBytes, ParameterDefaults.MIN_DEPOSIT)
    expect(tx1).toBeTruthy()

    // should throw on dupe apply
    try {
      const tx2 = await registry.apply(web3, listBytes, ParameterDefaults.MIN_DEPOSIT)
      // should never be called as catch should happen
      expect(false).toBe(true)
    } catch(err) {
      expect(err).toBeTruthy()
    }
  })

  it('adds a listing that went unchallenged', async () => {
    const listBytes = stringToBytes(web3, 'listing.com'),
      tx1 = await registry.apply(web3, listBytes, ParameterDefaults.MIN_DEPOSIT)

    await increaseTime(provider, ParameterDefaults.APPLY_STAGE_LENGTH + 1)
    const tx2 = await registry.updateStatus(web3, listBytes)
    expect(tx2).toBeTruthy()
    expect(await registry.isWhitelisted(listBytes)).toBe(true)
  })

  describe('token tranfer functionality', () => {
    it('reverts if token transfer from user fails', async () => {
      // change the approved funding for 0th account to 0
      await erc20.approve(web3, registry.getAddress(), 0, { from: accounts[0]})

      try {
        await registry.apply(web3, stringToBytes(web3, 'nope.com'), ParameterDefaults.MIN_DEPOSIT)
        // should not be called
        expect(false).toBe(true)
      } catch(err) {
        expect(err).toBeTruthy()
      }
    })

    it('reverts if deposit less than min_deposit', async () => {
      const listBytes = stringToBytes(web3, 'listing.com')

      try {
        await registry.apply(web3, listBytes, ParameterDefaults.MIN_DEPOSIT - 1)
        expect(false).toBe(true)
      } catch(err) {
        expect(err).toBeTruthy()
      }
    })

    // TODO the WS listener never fires if we use it here, investigate why
    it('should revert if applicationExpiry would overflow', async () => {
      const eth = web3.eth
      const bigOne = new BigNumber(1)
      const block:Block = await eth.getBlock(await eth.getBlockNumber())

      expect(block).toBeTruthy()
      // create an applyStageLen that, when added to current block time will be
      // greater than 2^256-1
      const maxUint = new BigNumber(2).pow(256).minus(bigOne),
        applyStageLen = maxUint.minus(new BigNumber(block.timestamp)).plus(bigOne),
        propID = eventsReturnValues('_ReparameterizationProposal',
          await parameterizer.proposeReparameterization(web3, 'applyStageLen',
            applyStageLen.toString(10), { from: accounts[1] }), 'propID')

      expect(propID).toBeTruthy()

      await increaseTime(provider, ParameterDefaults.P_APPLY_STAGE_LENGTH + 1)
      await parameterizer.processProposal(web3, propID)

      // assure prop was processed
      const actualLen = await parameterizer.get('applyStageLen')
      expect(actualLen).toBe(applyStageLen.toString(10))

      const listBytes = stringToBytes(web3, 'uhoh.net')

      try {
        await registry.apply(web3, listBytes, ParameterDefaults.MIN_DEPOSIT)
        expect(false).toBe(true)
      } catch(err) {
        expect(err).toBeTruthy()
      }
    })
  })
})
