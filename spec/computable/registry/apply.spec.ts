import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract, Block } from 'web3/types.d'
import { stringToBytes, increaseTime } from '../../helpers'
import Eip20 from '../../../src/contracts/eip-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'
import { ParameterDefaults, NAME } from '../../../src/constants'
import {
  deployDll,
  deployAttributeStore,
  maybeParseInt,
  eventReturnValues,
} from '../../../src/helpers'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Eip20,
  dll:Contract,
  store:Contract,
  voting:Voting,
  parameterizer:Parameterizer,
  registry:Registry

describe('Registry: Apply', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = new Eip20(accounts[0])
    const tokenAddress = await eip20.deploy(web3)
    eip20.setProvider(provider)

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
    await eip20.approve(votingAddress, 1000000)
    await eip20.approve(registryAddress, 1000000)

    // 1st account needs funding
    await eip20.transfer(accounts[1], 500000)
    await eip20.approve(registryAddress, 250000, { from: accounts[1] })
    await eip20.approve(parameterizerAddress, 250000, { from: accounts[1] })
  })

  it('allows a new application', async () => {
    const listBytes = stringToBytes(web3, 'listing.com'),
      tx1 = await registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT)

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

    const tx1 = await registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT)
    expect(tx1).toBeTruthy()

    // should throw on dupe apply
    try {
      const tx2 = await registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT)
      // should never be called as catch should happen
      expect(false).toBe(true)
    } catch(err) {
      expect(err).toBeTruthy()
    }
  })

  it('adds a listing that went unchallenged', async () => {
    const listBytes = stringToBytes(web3, 'listing.com'),
      tx1 = await registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT)

    await increaseTime(provider, ParameterDefaults.APPLY_STAGE_LENGTH + 1)
    const tx2 = await registry.updateStatus(listBytes)
    expect(tx2).toBeTruthy()
    expect(await registry.isWhitelisted(listBytes)).toBe(true)
  })

  describe('token tranfer functionality', () => {
    it('reverts if token transfer from user fails', async () => {
      // change the approved funding for 0th account to 0
      await eip20.approve(registry.getAddress(), 0, { from: accounts[0]})

      try {
        await registry.apply(stringToBytes(web3, 'nope.com'), ParameterDefaults.MIN_DEPOSIT)
        // should not be called
        expect(false).toBe(true)
      } catch(err) {
        expect(err).toBeTruthy()
      }
    })

    it('reverts if deposit less than min_deposit', async () => {
      const listBytes = stringToBytes(web3, 'listing.com')

      try {
        await registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT - 1)
        expect(false).toBe(true)
      } catch(err) {
        expect(err).toBeTruthy()
      }
    })

    // TODO the WS listener never fires if we use it here, investigate why
    it('should revert if applicationExpiry would overflow', async () => {
      const BN = web3.utils.BN,
        eth = web3.eth,
        bigOne = new BN(1),
        block:Block = await eth.getBlock(await eth.getBlockNumber())

      expect(block).toBeTruthy()
      // create an applyStageLen that, when added to current block time will be
      // greater than 2^256-1
      const maxUint = new BN(2).pow(new BN(256)).sub(bigOne),
        applyStageLen = maxUint.sub(new BN(block.timestamp)).add(bigOne),
        propID = eventReturnValues('_ReparameterizationProposal',
          await parameterizer.proposeReparameterization('applyStageLen',
            applyStageLen.toString(10), { from: accounts[1] }), 'propID')

      expect(propID).toBeTruthy()

      await increaseTime(provider, ParameterDefaults.P_APPLY_STAGE_LENGTH + 1)
      await parameterizer.processProposal(propID)

      // assure prop was processed
      const actualLen = await parameterizer.get('applyStageLen')
      expect(actualLen).toBe(applyStageLen.toString(10))

      const listBytes = stringToBytes(web3, 'uhoh.net')

      try {
        await registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT)
        expect(false).toBe(true)
      } catch(err) {
        expect(err).toBeTruthy()
      }
    })
  })
})
