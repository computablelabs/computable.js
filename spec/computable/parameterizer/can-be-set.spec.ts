import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { EventEmitter, EventLog } from '../../../node_modules/web3/types.d'
import { increaseTime } from '../../helpers'
import { onData } from '../../../src/helpers'
import Eip20 from '../../../src/contracts/eip-20'
import Parameterizer from '../../../src/contracts/parameterizer'
import { Addresses, ParameterDefaults } from '../../../src/constants'


let server:any,
  provider:any,
  web3:Web3,
  accounts:string[],
  eip20:Eip20,
  parameterizer:Parameterizer

beforeAll(() => {
  server = ganache.server({ws:true})
  server.listen(8546)

  provider = new Web3.providers.WebsocketProvider('ws://localhost:8546')
  web3 = new Web3(provider)
})

afterAll(() => {
  server.close()
  server = null
})

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
    const emitter = parameterizer.getEventEmitter('_ReparameterizationProposal')
    // the actual call, no need to wait for the TX as we'll use the async listener for an event log
    parameterizer.proposeReparameterization('voteQuorum', 51)
    // the await here returns the full event log object
    const log = await onData(emitter),
      propID = log.returnValues.propID

    expect(propID).toBeTruthy()
    // @ts-ignore:2532 // TODO pr Web3 to fix their EventEmitter interface
    expect(Object.keys(emitter._events).length).toBe(1)
    // should be able to stop listening
    // @ts-ignore:2339
    emitter.off('data')
    // @ts-ignore:2532
    expect(Object.keys(emitter._events).length).toBe(0)
    // const propID = eventReturnValues('_ReparameterizationProposal',
      // await parameterizer.proposeReparameterization('voteQuorum', 51), 'propID')

    increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    increaseTime(provider, ParameterDefaults.P_REVEAL_STAGE_LENGTH + 1)

    expect(await parameterizer.canBeSet(propID)).toBe(true)
  })

  it('should be falsy if proposal did not pass challenge phase', async () => {
    const emitter = parameterizer.getEventEmitter('_ReparameterizationProposal')
    // the actual call, no need to wait for the TX as we'll use the async listener for an event log
    parameterizer.proposeReparameterization('dispensationPct', 58)
    // the await here returns the full event log object
    const log = await onData(emitter),
      propID = log.returnValues.propID

    expect(propID).toBeTruthy()
    expect(await parameterizer.canBeSet(propID)).toBe(false)

    // should become true if commit stage length is increased
    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    expect(await parameterizer.canBeSet(propID)).toBe(true)
  })
})
