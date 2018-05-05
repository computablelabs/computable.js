import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import { deployToken, deployParameterizer, increaseTime } from '../../helpers'
import { Addresses, ParameterDefaults } from '../../../src/constants'
import Bignumber from 'bignumber'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Contract,
  parameterizer:Contract

describe('Parameterizer: Process a proposal', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = await deployToken(web3, accounts[0])
    eip20.setProvider(provider)
    const tokenAddress = eip20.options.address

    parameterizer = await deployParameterizer(web3, accounts[0], tokenAddress, Addresses.THREE) // THREE placeholding plcr TODO
    parameterizer.setProvider(provider)

    // approve the parameterizer with the token, account[0] has all the balance atm
    await eip20.methods.approve(parameterizer.options.address, 1000000).send({ from: accounts[0] })
  })

  it('can process a proposal', async () => {
    const applicantStartingBalance = await eip20.methods.balanceOf(accounts[0]).call()
    expect(applicantStartingBalance).toBe('5000000')

    const tx = await parameterizer.methods.proposeReparameterization('voteQuorum', 51).send({ from: accounts[0] })
    expect(tx).toBeTruthy()

    const tx2 = await increaseTime(provider, ParameterDefaults.P_APPLY_STAGE_LENGTH + 1)
    expect(tx2).toBeTruthy()
    // propId is nested in the event TODO change to using the event listener when they work
    const propID = tx.events._ReparameterizationProposal.returnValues.propID,
      tx3 = await parameterizer.methods.processProposal(propID).send({ from: accounts[0] })
    expect(tx3).toBeTruthy()
    // we should see the changes now
    const vq = await parameterizer.methods.get('voteQuorum').call()
    expect(vq).toBe('51')
    // the proposer should have had their tokens returned
    const applicantFinalBalance = await eip20.methods.balanceOf(accounts[0]).call()
    expect(applicantStartingBalance).toBe(applicantFinalBalance)
  })

})
