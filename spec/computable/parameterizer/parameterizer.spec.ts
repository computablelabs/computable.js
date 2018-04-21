import * as ganache from 'ganache-cli'
import Web3 from 'web3'
// symlink? copy types to @types? TODO
import { Contract } from '../../../node_modules/web3/types.d'
import json from '../../../computable/build/contracts/Parameterizer.json'
import {
  Addresses,
  Token,
  ParameterDefaults,
} from '../../../src/constants'

// TODO use the web3 IProvider?
const provider:any = ganache.provider()

const web3 = new Web3(provider)

let accounts:string[], parameterizer:Contract

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  parameterizer = await new web3.eth.Contract(json.abi)
    .deploy({ data: json.bytecode, arguments: [
      Token.address,
      Addresses.Three, // will be used for the PLCRVoting.address
      ParameterDefaults.MinDeposit,
      ParameterDefaults.PMinDeposit,
      ParameterDefaults.ApplyStageLength,
      ParameterDefaults.PApplyStageLength,
      ParameterDefaults.CommitStageLength,
      ParameterDefaults.PCommitStageLength,
      ParameterDefaults.RevealStageLength,
      ParameterDefaults.PRevealStageLength,
      ParameterDefaults.DispensationPct,
      ParameterDefaults.PDispensationPct,
      ParameterDefaults.VoteQuorum,
      ParameterDefaults.PVoteQuorum
    ]})
    .send({ from: accounts[0], gas: '5000000' }) // NOTE watch the gas limit here

  parameterizer.setProvider(provider)
})

describe('Parameterizer', () => {
  // describe('Expected failures', () => {
    // it('throws if called by non-owner', async () => {
      // try {
        // await validator.methods.addVote('foo').send({
          // from: accounts[1],
        // })

        // // this should never be run as we should throw above
        // expect(false).toBe(true)

      // } catch(e) {
        // expect(e).toBeTruthy()
      // }
    // })
  // })

  it('can be instantiated (with that ridiculous amount of args...)', () => {
    expect(parameterizer).toBeTruthy()
  })

  it('has a functioning get method', async () => {
    const minD = await parameterizer.methods.get('minDeposit').call()
    expect(parseInt(minD)).toBe(10)
  })
})
