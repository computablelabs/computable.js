import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { increaseTime } from '../../helpers'
import { eventReturnValues } from '../../../src/helpers'
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
    const propID = eventReturnValues('_ReparameterizationProposal',
      await parameterizer.proposeReparameterization('voteQuorum', 51), 'propID')

    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    await increaseTime(provider, ParameterDefaults.P_REVEAL_STAGE_LENGTH + 1)

    expect(await parameterizer.canBeSet(propID)).toBe(true)
  })

  it('should be falsy if proposal did not pass challenge phase', async () => {
    const propID = eventReturnValues('_ReparameterizationProposal',
      await parameterizer.proposeReparameterization('dispensationPct', '58'), 'propID')

    expect(await parameterizer.canBeSet(propID)).toBe(false)

    // should become true if commit stage length is increased
    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    expect(await parameterizer.canBeSet(propID)).toBe(true)
  })
})
