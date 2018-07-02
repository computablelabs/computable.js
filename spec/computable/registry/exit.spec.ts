import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract, Block } from 'web3/types.d'
import { stringToBytes, increaseTime } from '../../helpers'
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

beforeAll(() => {
  server = ganache.server({ws:true})
  server.listen(8559)

  provider = new Web3.providers.WebsocketProvider('ws://localhost:8559')
  web3 = new Web3(provider)
})

afterAll(() => {
  server.close()
  server = null
})

describe('Registry: Exit', () => {
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

    await erc20.approve(registryAddress, 1000000)

    // applicant needs funding
    await erc20.transfer(applicant, 500000)
    await erc20.approve(registryAddress, 250000, { from: applicant })
    await erc20.approve(parameterizerAddress, 250000, { from: applicant })

  })

  // TODO: This documents current behavior, but we likely want to
  // remove this functionality so listings *cannot* be de-listed
  // since we want to enforce immutability.
  it('should allow a listing to exit when no challenge exists', async () => {
    const listBytes = stringToBytes(web3, 'listing.net'),
      applicantStartingBalance = maybeParseInt(await erc20.balanceOf(applicant))

    // Apply
    const tx1 = registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT, '', { from: applicant })
    expect(tx1).toBeTruthy()

    // Check that the listing has been posted
    const listing = await registry.listings(listBytes)
    expect(listing).toBeTruthy()

    // Listing is un-challenged during apply stage and subsequently whitelisted.
    await increaseTime(provider, ParameterDefaults.APPLY_STAGE_LENGTH + 1)
    const tx2 = await registry.updateStatus(listBytes)
    expect(tx2).toBeTruthy()
    expect(await registry.isWhitelisted(listBytes)).toBe(true)

    // Exit 
    const tx3 = registry.exit(listBytes, { from: applicant })
    expect(tx3).toBeTruthy()
    expect(await registry.isWhitelisted(listBytes)).toBe(false)

    // The applicant's tokens should be returned on exit
    const applicantFinalBalance = maybeParseInt(await erc20.balanceOf(applicant))
    expect(applicantStartingBalance).toBe(applicantFinalBalance)

  })

})
