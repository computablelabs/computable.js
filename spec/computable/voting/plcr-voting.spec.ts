import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import {
  deployToken,
  deployDll,
  deployAttributeStore,
  deployVoting,
} from '../helpers'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Contract,
  dll:Contract,
  store:Contract,
  voting:Contract

describe('PLCRVoting', () => {
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
  })

  it('has deployed', async () => {
    expect(voting).toBeTruthy()
  })

})
