import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import { NAME } from '../../../src/constants'
import {
  deployToken,
  deployDll,
  deployAttributeStore,
  deployVoting,
  deployParameterizer,
  deployRegistry,
} from '../../helpers'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Contract,
  dll:Contract,
  store:Contract,
  voting:Contract,
  parameterizer:Contract,
  registry:Contract

describe('Registry', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = await deployToken(web3, accounts[0])
    eip20.setProvider(provider)
    const tokenAddress = eip20.options.address

    dll = await deployDll(web3, accounts[0])
    dll.setProvider(provider)
    const dllAddress = dll.options.address

    store = await deployAttributeStore(web3, accounts[0])
    store.setProvider(provider)
    const storeAddress = store.options.address

    voting = await deployVoting(web3, accounts[0], dllAddress, storeAddress, tokenAddress)
    voting.setProvider(provider)
    const votingAddress = voting.options.address

    parameterizer = await deployParameterizer(web3, accounts[0], tokenAddress, votingAddress)
    parameterizer.setProvider(provider)
    const parameterizerAddress = parameterizer.options.address

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
    expect(regToken).toBe(eip20.options.address)

    const regParam = await registry.methods.parameterizer().call()
    expect(regParam).toBe(parameterizer.options.address)

    const regVote = await registry.methods.voting().call()
    expect(regVote).toBe(voting.options.address)

    const name = await registry.methods.name().call()
    expect(name).toBe(NAME)
  })

})
