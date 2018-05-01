import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import { deployToken, deployVoting } from '../helpers'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Contract,
  voting:Contract

describe('PLCRVoting', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = await deployToken(web3, accounts[0])
    eip20.setProvider(provider)
    const tokenAddress = eip20.options.address

    voting = await deployVoting(web3, accounts[0], tokenAddress )
    voting.setProvider(provider)
  })

  it('has deployed', async () => {
    expect(voting).toBeTruthy()
  })

})
