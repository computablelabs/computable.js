import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types.d'
import { whitelist } from '../../helpers'
import Erc20 from '../../../src/contracts/erc-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'
import { ParameterDefaults, NAME } from '../../../src/constants'
import { RegistryListing  } from '../../../src/interfaces'
import { Nos } from '../../../src/types'
import {
  deployDll,
  deployAttributeStore,
  maybeParseInt,
  stringToBytes,
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
  applicant:string,
  challenger:string

// TODO also displays timing issues with WS server ascertain...
describe('Registry: Challenge', () => {
  beforeAll(() => {
    server = ganache.server({ws:true})
    server.listen(8458)

    provider = new Web3.providers.WebsocketProvider('ws://localhost:8458')
    web3 = new Web3(provider)
  })

  afterAll(() => {
    server.close()
    server = null
  })

  beforeEach(async () => {
    [owner, applicant, challenger] = await web3.eth.getAccounts()

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

    //owner approves voting and reg to spend
    // await erc20.approve(votingAddress, 1000000)
    await erc20.approve(web3, registryAddress, 1000000)

    // applicant needs funding
    await erc20.transfer(web3, applicant, 500000)
    await erc20.approve(web3, registryAddress, 250000, { from: applicant })
    await erc20.approve(web3, parameterizerAddress, 250000, { from: applicant })

    // challenger needs funding
    await erc20.transfer(web3, challenger, 500000)
    await erc20.approve(web3, registryAddress, 250000, { from: challenger })
    await erc20.approve(web3, parameterizerAddress, 250000, { from: challenger })
  })

  it('can increase the deposit for a specific listing', async () => {
    const listBytes = stringToBytes(web3, 'listing.net'),
      whitelisted = await whitelist(web3, provider, registry, listBytes, applicant),
      incBy = ParameterDefaults.MIN_DEPOSIT / 2

    let listing:RegistryListing, unstaked:Nos

    expect(whitelisted).toBe(true)

    listing= await registry.listings(listBytes),
      unstaked = maybeParseInt(listing.unstakedDeposit)

    expect(unstaked).toBe(ParameterDefaults.MIN_DEPOSIT)

    // increase the deposit amount by 50%
    const tx = await registry.deposit(web3, listBytes, incBy, { from: applicant })
    expect(tx).toBeTruthy()

    listing= await registry.listings(listBytes),
      unstaked = maybeParseInt(listing.unstakedDeposit)

    expect(unstaked).toBe(ParameterDefaults.MIN_DEPOSIT + incBy)
  })

  it('should revert if sender not the listing owner', async () => {
    const listBytes = stringToBytes(web3, 'nope.net')
    await whitelist(web3, provider, registry, listBytes, applicant)

    try {
      await registry.deposit(web3, listBytes, 5, { from: challenger })
      // should never hit this
      expect(false).toBe(true)
    } catch(err) {
      expect(err).toBeTruthy()
    }
  })
})
