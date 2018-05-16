import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { increaseTime } from '../../helpers'
import Eip20 from '../../../src/contracts/eip20'
import Parameterizer from '../../../src/contracts/parameterizer'
import { Addresses, ParameterDefaults } from '../../../src/constants'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Eip20,
  parameterizer:Parameterizer

describe('Parameterizer: canBeSet', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = new Eip20(accounts[0])
    const tokenAddress = await eip20.deploy(web3)
    eip20.setProvider(provider)

    parameterizer = new Parameterizer(accounts[0])
    // using dummy address for voting here
    const parameterizerAddress = await parameterizer.deploy(web3, { tokenAddress, votingAddress: Addresses.THREE })
    parameterizer.setProvider(provider)

    // approve the parameterizer with the token, account[0] has all the balance atm
    await eip20.approve(parameterizerAddress, 1000000)
  })

  it('should be truthy if a proposal passed its application stage with no challenge', async () => {
    const tx = await parameterizer.proposeReparameterization('voteQuorum', 51)
    expect(tx).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    await increaseTime(provider, ParameterDefaults.P_REVEAL_STAGE_LENGTH + 1)
    // propID is nested in the event TODO change to using the event listener when they work
    const propID = tx.events && tx.events._ReparameterizationProposal.returnValues.propID

    const res = await parameterizer.canBeSet(propID)
    expect(res).toBe(true)
  })

  it('should be falsy if proposal did not pass challenge phase', async () => {
    const tx = await parameterizer.proposeReparameterization('dispensationPct', '58')
    expect(tx).toBeTruthy()

    const propID = tx.events && tx.events._ReparameterizationProposal.returnValues.propID,
      shouldBeFalse = await parameterizer.canBeSet(propID)
    expect(shouldBeFalse).toBe(false)

    // should become true if commit stage length is increased
    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    const shouldBeTrue = await parameterizer.canBeSet(propID)
    expect(shouldBeTrue).toBe(true)
  })
})
