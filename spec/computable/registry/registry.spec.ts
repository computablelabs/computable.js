import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import { NAME } from '../../../src/constants'
import {
  deployDll,
  deployAttributeStore,
  deployRegistry,
} from '../../../src/helpers'
import Eip20 from '../../../src/contracts/eip20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Eip20,
  dll:Contract,
  store:Contract,
  voting:Voting,
  parameterizer:Parameterizer,
  registry:Contract

describe('Registry', () => {
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

    registry = await deployRegistry(
      web3, accounts[0], tokenAddress, votingAddress, parameterizerAddress, NAME
    )
    registry.setProvider(provider)
    const registryAddress = registry.options.address
  })

  it('has deployed, setting correct state', async () => {
    expect(registry).toBeTruthy()
    expect(registry.options.address).toBeTruthy()

    const regToken = await registry.methods.token().call()
    expect(regToken).toBe(eip20.getAddress())

    const regParam = await registry.methods.parameterizer().call()
    expect(regParam).toBe(parameterizer.getAddress())

    const regVote = await registry.methods.voting().call()
    expect(regVote).toBe(voting.getAddress())

    const name = await registry.methods.name().call()
    expect(name).toBe(NAME)
  })

})
