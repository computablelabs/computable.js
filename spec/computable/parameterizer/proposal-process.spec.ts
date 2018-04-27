import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import pJson from '../../../computable/build/contracts/Parameterizer.json'
import tJson from '../../../computable/build/contracts/EIP20.json'
import { getDefaults, increaseTime } from './helpers'
import { ParameterDefaults, Addresses, Token } from '../../../src/constants'
import Bignumber from 'bignumber'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Contract,
  parameterizer:Contract

describe('Parameterizer: Reparamaterize', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    // paramaterizer needs a deployed token
    eip20 = await new web3.eth.Contract(tJson.abi, undefined, { gasPrice: 100, gas: 4500000 })
      .deploy({ data: tJson.bytecode, arguments: [
        Token.supply,
        Token.name,
        Token.decimals,
        Token.symbol
      ]})
      .send({ from: accounts[0] }) // NOTE watch the gas limit here

    eip20.setProvider(provider)
    const tokenAddress = eip20.options.address

    // use the deployed token address
    parameterizer = await new web3.eth.Contract(pJson.abi, undefined, { gasPrice: 100, gas: 4500000 })
      .deploy({ data: pJson.bytecode, arguments: [
        tokenAddress,
        Addresses.Three, // TODO use deployed voting contract
        ...getDefaults()
      ]})
      .send({ from: accounts[0] })

    parameterizer.setProvider(provider)

    // approve the parameterizer with the token, account[0] has all the balance atm
    await eip20.methods.approve(parameterizer.options.address, 1000000).send({ from: accounts[0] })
  })

  it('can process a proposal', async () => {
    const applicantStartingBalance = await eip20.methods.balanceOf(accounts[0]).call()
    expect(applicantStartingBalance).toBe('5000000')

    const tx = await parameterizer.methods.proposeReparameterization('voteQuorum', 51).send({ from: accounts[0] })
    expect(tx).toBeTruthy()

    const tx2 = await increaseTime(provider, ParameterDefaults.PApplyStageLength + 1)
    expect(tx2).toBeTruthy()
    // propId is nested in the event TODO change to using the event listener when they work
    const propID = tx.events._ReparameterizationProposal.returnValues.propID,
      tx3 = await parameterizer.methods.processProposal(propID).send({ from: accounts[0] })
    expect(tx3).toBeTruthy()
    // we should see the changes now
    const vq = await parameterizer.methods.get('voteQuorum').call()
    expect(vq).toBe('51')
    // the proposer should have had their tokens returned
    const applicantFinalBalance = await eip20.methods.balanceOf(accounts[0]).call()
    expect(applicantStartingBalance).toBe(applicantFinalBalance)
  })

})
