import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { increaseTime } from '../../helpers'
import { onData } from '../../../src/helpers'
import { Addresses, ParameterDefaults } from '../../../src/constants'
import Eip20 from '../../../src/contracts/eip-20'
import Parameterizer from '../../../src/contracts/parameterizer'

let web3:Web3,
  server:any,
  provider:any,
  accounts:string[],
  eip20:Eip20,
  parameterizer:Parameterizer

beforeAll(() => {
  server = ganache.server({ws:true})
  server.listen(8547)

  provider = new Web3.providers.WebsocketProvider('ws://localhost:8547')
  web3 = new Web3(provider)
})

afterAll(() => {
  server.close()
  server = null
})

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

    const emitter = parameterizer.getEventEmitter('_ReparameterizationProposal')
    parameterizer.proposeReparameterization('voteQuorum', 51)

    const log = await onData(emitter),
      propID = log.returnValues.propID

    await increaseTime(provider, ParameterDefaults.P_APPLY_STAGE_LENGTH + 1)

    const tx3 = await parameterizer.processProposal(propID)
    expect(tx3).toBeTruthy()
    // we should see the changes now
    const vq = await parameterizer.get('voteQuorum')
    expect(vq).toBe('51')
    // the proposer should have had their tokens returned
    const applicantFinalBalance = await eip20.balanceOf(accounts[0])
    expect(applicantStartingBalance).toBe(applicantFinalBalance)
  })

})
