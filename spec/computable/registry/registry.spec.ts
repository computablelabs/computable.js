import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types.d'
import { NAME } from '../../../src/constants'
import { deployDll, deployAttributeStore } from '../../../src/helpers'
import Erc20 from '../../../src/contracts/erc-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'

let web3:Web3,
  server:any,
  provider:any,
  accounts:string[],
  erc20:Erc20,
  dll:Contract,
  store:Contract,
  voting:Voting,
  parameterizer:Parameterizer,
  registry:Registry

beforeAll(() => {
  server = ganache.server({ws:true})
  server.listen(8552)

  provider = new Web3.providers.WebsocketProvider('ws://localhost:8552')
  web3 = new Web3(provider)
})

describe('Registry', () => {
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
  })

  it('has deployed, setting correct state', async () => {
    expect(registry).toBeTruthy()
    expect(registry.getAddress).toBeTruthy()

    const regToken = await registry.token()
    expect(regToken).toBe(erc20.getAddress())

    const regParam = await registry.parameterizer()
    expect(regParam).toBe(parameterizer.getAddress())

    const regVote = await registry.voting()
    expect(regVote).toBe(voting.getAddress())

    const name = await registry.name()
    expect(name).toBe(NAME)
  })

})
