import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Addresses, Token } from '../../../src/constants'
import Parameterizer from '../../../src/contracts/parameterizer'
import { maybeParseInt } from '../../../src/helpers'

let server:any, provider:any, web3:Web3, accounts:string[], parameterizer:Parameterizer

describe('Parameterizer', () => {
  // startup the test rpc making sure a websocket server is running
  beforeAll(() => {
    server = ganache.server({ws:true})
    server.listen(8445)

    // TODO use the web3 IProvider?
    provider = new Web3.providers.WebsocketProvider('ws://localhost:8445')
    web3 = new Web3(provider)
  })

  afterAll(() => {
    server.close()
    server = null
  })

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    parameterizer = new Parameterizer(accounts[0])
    const parameterizerAddress = await parameterizer.deploy(web3, {
      tokenAddress: Addresses.TWO,
      votingAddress: Addresses.THREE
    })

    parameterizer.setProvider(provider)
  })

  it('can be instantiated (with that ridiculous amount of args...)', () => {
    expect(parameterizer).toBeTruthy()
  })

  it('has a functioning get method', async () => {
    const minD = await parameterizer.get('minDeposit')
    expect(maybeParseInt(minD)).toBe(10)
  })

  it('can be instantiated from an existing deployment', async () => {
    const address = parameterizer.getAddress(),
      other = new Parameterizer(accounts[0]),
      works = await other.at(web3, { address })

    expect(works).toBe(true)
    expect(other.getDeployed()).toBeTruthy()

    const quorum = await other.get('voteQuorum')
    expect(maybeParseInt(quorum)).toBe(50)
  })
})
