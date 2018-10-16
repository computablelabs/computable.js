import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract, Block } from 'web3/types'
import Erc20 from '../../../src/contracts/erc-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'
import { ParameterDefaults, NAME } from '../../../src/constants'
import {
  deployDll,
  deployAttributeStore,
  maybeParseInt,
  onData,
  stringToBytes,
  increaseTime,
} from '../../../src/helpers'

let web3:Web3,
  server:any,
  provider:any,
  accounts:string[],
  erc20:Erc20,
  dll:Contract,
  store:Contract,
  voting:Voting,
  parameterizer:Parameterizer,
  registry:Registry,
  owner:string,
  applicant:string

describe('Registry: Withdraw', () => {

  beforeAll(() => {
    server = ganache.server({ws:true})
    server.listen(8560)

    provider = new Web3.providers.WebsocketProvider('ws://localhost:8560')
    web3 = new Web3(provider)
  })

  afterAll(() => {
    server.close()
    server = null
  })

  beforeEach(async () => {
    [owner, applicant] = await web3.eth.getAccounts()

    erc20 = new Erc20(owner)
    const tokenAddress = await erc20.deploy(web3)
    erc20.setProvider(provider)

    dll = await deployDll(web3, owner)
    dll.setProvider(provider)
    const dllAddress = dll.options.address

    store = await deployAttributeStore(web3, owner)
    store.setProvider(provider)
    const attributeStoreAddress = store.options.address

    voting = new Voting(owner)
    const votingAddress = await voting.deploy(web3, { tokenAddress, dllAddress, attributeStoreAddress })
    voting.setProvider(provider)

    parameterizer = new Parameterizer(owner)
    const parameterizerAddress = await parameterizer.deploy(web3, { tokenAddress, votingAddress })
    parameterizer.setProvider(provider)

    registry = new Registry(owner)
    const registryAddress = await registry.deploy(web3, { tokenAddress, votingAddress, parameterizerAddress, name: NAME })
    registry.setProvider(provider)

    await erc20.approve(web3, registryAddress, 1000000)

    // applicant needs funding
    await erc20.transfer(web3, applicant, 500000)
    await erc20.approve(web3, registryAddress, 250000, { from: applicant })
    await erc20.approve(web3, parameterizerAddress, 250000, { from: applicant })

  })

  it('should not withdraw tokens from a listing that has a deposit === minDeposit', async () => {
    const listBytes = stringToBytes(web3, 'dontchallenge.net'),
      applicantStartingBalance = maybeParseInt(await erc20.balanceOf(applicant))

    // Apply
    const tx1 = registry.apply(web3, listBytes, ParameterDefaults.MIN_DEPOSIT, '', { from: applicant })
    expect(tx1).toBeTruthy()

    // Check that the listing has been posted
    const listing = await registry.listings(listBytes)
    expect(listing).toBeTruthy()

    // Listing is un-challenged during apply stage and subsequently whitelisted.
    await increaseTime(provider, ParameterDefaults.APPLY_STAGE_LENGTH + 1)
    const tx2 = await registry.updateStatus(web3, listBytes)
    expect(tx2).toBeTruthy()
    expect(await registry.isWhitelisted(listBytes)).toBe(true)

    // Get original deposit
    const origDeposit = maybeParseInt(listing.unstakedDeposit)
    expect(origDeposit).toBe(ParameterDefaults.MIN_DEPOSIT)

    // Withdraw
    try {
      const withdrawAmount = ParameterDefaults.MIN_DEPOSIT/2.0
      const tx3 = await registry.withdraw(web3, listBytes, withdrawAmount, { from: applicant })
    } catch (err) {
      // TODO: Do we want a more robust error detection scheme?
      expect(err.toString().includes('revert')).toBe(true)
    }

    // Get after failed withdraw deposit
    const listingAfterDeposit = await registry.listings(listBytes)
    const depositAfterWithdraw = maybeParseInt(listingAfterDeposit.unstakedDeposit)

    // Check deposit not changed
    expect(origDeposit).toBe(depositAfterWithdraw)
  })
})
