import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types.d'
import { increaseTime } from '../../helpers'
import { onData } from '../../../src/helpers'
import { deployDll, deployAttributeStore } from '../../../src/helpers'
import { ParameterDefaults } from '../../../src/constants'
import Erc20 from '../../../src/contracts/erc-20'
import Parameterizer from '../../../src/contracts/parameterizer'
import Voting from '../../../src/contracts/plcr-voting'

let web3:Web3,
  server:any,
  provider:any,
  accounts:string[],
  erc20:Erc20,
  dll:Contract,
  store:Contract,
  voting:Voting,
  parameterizer:Parameterizer

describe('Parameterizer: challengeCanBeResolved', () => {
  beforeAll(() => {
    server = ganache.server({ws:true})
    server.listen(8543)

    provider = new Web3.providers.WebsocketProvider('ws://localhost:8543')
    web3 = new Web3(provider)
  })

  afterAll(() => {
    server.close()
    server = null
  })

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    erc20 = new Erc20(accounts[0])
    const tokenAddress = await erc20.deploy(web3)
    erc20.setProvider(provider)

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

    // approve the parameterizer with the token, account[0] has all the balance atm
    await erc20.approve(parameterizerAddress, 1000000)
    // challenger (accounts[1]) needs token funds to spend
    await erc20.transfer(accounts[1], 500000)
    // parameterizer must be approved to spend on [1]'s behalf
    await erc20.approve(parameterizerAddress, 450000, { from: accounts[1] })
  })

  it('should be truthy if a challenge is ready to be resolved', async () => {
    const emitter = parameterizer.getEventEmitter('_ReparameterizationProposal')
    // the actual call, no need to wait for the TX as we'll use the async listener for an event log
    parameterizer.proposeReparameterization('voteQuorum', 51)
    // the await here returns the full event log object
    const log = await onData(emitter),
      propID = log.returnValues.propID

    const tx1 = await parameterizer.challengeReparameterization(propID, { from: accounts[1] })
    expect(tx1).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    await increaseTime(provider, ParameterDefaults.P_REVEAL_STAGE_LENGTH + 1)

    const res = await parameterizer.challengeCanBeResolved(propID)
    expect(res).toBe(true)
  })

  it('should be falsy if challenge not ready', async () => {
    const emitter = parameterizer.getEventEmitter('_ReparameterizationProposal')
    parameterizer.proposeReparameterization('voteQuorum', 51)

    const log = await onData(emitter),
      propID = log.returnValues.propID

    const tx1 = await parameterizer.challengeReparameterization(propID, { from: accounts[1] })
    expect(tx1).toBeTruthy()

    await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    // NOTE reveal stage length is the determining factor here

    const res = await parameterizer.challengeCanBeResolved(propID)
    expect(res).toBe(false)
  })

})
