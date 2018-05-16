import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { increaseTime } from '../../helpers'
import { Addresses, ParameterDefaults } from '../../../src/constants'
import Eip20 from '../../../src/contracts/eip20'
import Parameterizer from '../../../src/contracts/parameterizer'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Eip20,
  parameterizer:Parameterizer

describe('Parameterizer: Process a proposal', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = new Eip20(accounts[0])
    const tokenAddress = await eip20.deploy(web3)
    eip20.setProvider(provider)

    parameterizer = new Parameterizer(accounts[0])
    const parameterizerAddress = await parameterizer.deploy(web3, { tokenAddress, votingAddress: Addresses.THREE })
    parameterizer.setProvider(provider)

    // approve the parameterizer with the token, account[0] has all the balance atm
    await eip20.approve(parameterizerAddress, 1000000)
  })

  it('can process a proposal', async () => {
    const applicantStartingBalance = await eip20.balanceOf(accounts[0])
    expect(applicantStartingBalance).toBe('5000000')

    const tx = await parameterizer.proposeReparameterization('voteQuorum', 51)
    expect(tx).toBeTruthy()

    const tx2 = await increaseTime(provider, ParameterDefaults.P_APPLY_STAGE_LENGTH + 1)
    expect(tx2).toBeTruthy()
    // propId is nested in the event TODO change to using the event listener when they work
    const propID = tx.events && tx.events._ReparameterizationProposal.returnValues.propID,
      tx3 = await parameterizer.processProposal(propID)
    expect(tx3).toBeTruthy()
    // we should see the changes now
    const vq = await parameterizer.get('voteQuorum')
    expect(vq).toBe('51')
    // the proposer should have had their tokens returned
    const applicantFinalBalance = await eip20.balanceOf(accounts[0])
    expect(applicantStartingBalance).toBe(applicantFinalBalance)
  })

})
