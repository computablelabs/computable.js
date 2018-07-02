import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract, Block } from 'web3/types.d'
import { stringToBytes, increaseTime } from '../../helpers'
import Erc20 from '../../../src/contracts/erc-20'
import Voting from '../../../src/contracts/plcr-voting'
import Parameterizer from '../../../src/contracts/parameterizer'
import Registry from '../../../src/contracts/registry'
import { ParameterDefaults, NAME } from '../../../src/constants'
import {
  deployDll,
  deployAttributeStore,
  maybeParseInt,
  onData,
} from '../../../src/helpers'

let web3:Web3,
  server:any,
  provider:any,
  accounts:string[],
  erc20:Erc20,
  dll:Contract,
  store:Contract,
  voting:Voting,
  parameterizer:Parameterizer,
  registry:Registry,
  owner:string,
  applicant:string

beforeAll(() => {
  server = ganache.server({ws:true})
  server.listen(8559)

  provider = new Web3.providers.WebsocketProvider('ws://localhost:8559')
  web3 = new Web3(provider)
})

afterAll(() => {
  server.close()
  server = null
})

fdescribe('Registry: Exit', () => {
