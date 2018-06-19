import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types.d'
import { deployDll, deployAttributeStore } from '../../../src/helpers'
import { stringToBytes, increaseTime } from '../../helpers'
import Eip20 from '../../../src/contracts/eip-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'
import { ParameterDefaults, NAME } from '../../../src/constants'

let web3:Web3,
  server:any,
  provider:any,
  accounts:string[],
  eip20:Eip20,
  dll:Contract,
  store:Contract,
  voting:Voting,
  parameterizer:Parameterizer,
  registry:Registry

beforeAll(() => {
  server = ganache.server({ws:true})
  server.listen(8555)

  provider = new Web3.providers.WebsocketProvider('ws://localhost:8555')
  web3 = new Web3(provider)
})

describe('Registry', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = new Eip20(accounts[0])
    const tokenAddress = await eip20.deploy(web3)
    eip20.setProvider(provider)

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

    registry = new Registry(accounts[0])
    const registryAddress = await registry.deploy(web3, { tokenAddress, votingAddress, parameterizerAddress, name: NAME })
    registry.setProvider(provider)

    // 0th account approves voting and reg to spend
    await eip20.approve(votingAddress, 1000000)
    await eip20.approve(registryAddress, 1000000)
  })

  it('returns true if application expiry was previously initialized', async () => {
    const listBytes = stringToBytes(web3, 'listing.com'),
      tx1 = await registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT) // apply

    let result = await registry.appWasMade(listBytes)

    expect(result).toBe(true)

    // commit stage complete
    await increaseTime(provider, ParameterDefaults.COMMIT_STAGE_LENGTH + 1)
    result = await registry.appWasMade(listBytes)
    expect(result).toBe(true) // still true because not expired

    // reveal stage complete, update status (whitelist it)
    await increaseTime(provider, ParameterDefaults.REVEAL_STAGE_LENGTH + 1)
    const tx2 = await registry.updateStatus(listBytes)
    expect(tx2).toBeTruthy()

    const isWhitelisted = await registry.isWhitelisted(listBytes)
    expect(isWhitelisted).toBe(true)

    result = await registry.appWasMade(listBytes)
    expect(result).toBe(true) // still true since was whitelisted

    // exit
    const tx3 = await registry.exit(listBytes)
    expect(tx3).toBeTruthy()
    result = await registry.appWasMade(listBytes) // should be false now as exit was called
    expect(result).toBe(false)
  })

  it('returns falsy if applicationExpiry was not initialized', async () => {
    const listBytes = stringToBytes(web3, 'nope.com')

    expect(await registry.appWasMade(listBytes)).toBe(false)
  })
})
