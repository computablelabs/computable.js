import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Addresses } from '../../../src/constants'
import Eip20 from '../../../src/contracts/eip20'
import Parameterizer from '../../../src/contracts/parameterizer'
import { maybeParseInt, eventReturnValues } from '../../../src/helpers'

// TODO use the web3 IProvider?
const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Eip20,
  parameterizer:Parameterizer

describe('Parameterizer: Reparamaterize', () => {
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

  it('parameterizer has an allowance of a million', async () => {
    const allowance = await eip20.allowance(accounts[0], parameterizer.getAddress())
    expect(parseInt(allowance)).toBe(1000000)
  })

  it('returns falsy for non-existant proposal', async () => {
    // const pid = await parameterizer.methods.proposeReparameterization('voteQuorum', 51).send({ from: accounts[0], gasPrice: 100, gas: 4500000 })
    const res = await parameterizer.propExists(web3.utils.asciiToHex('foo'))
    expect(res).toBe(false)
  })

  describe('Add a new proposal', () => {
    it('adds a new proposal', async () => {
      const applicantStartingBalance = await eip20.balanceOf(accounts[0])
      expect(applicantStartingBalance).toBe('5000000')

      // propId is nested in the event TODO change to using the event listener when they work
      const propID = eventReturnValues('_ReparameterizationProposal',
        await parameterizer.proposeReparameterization('voteQuorum', 51), 'propID'),
        proposed = await parameterizer.proposals(propID)

      expect(proposed.name).toBe('voteQuorum')
      expect(proposed.value).toBe('51')

      // proposer should have been charged PMinDeposit
      const deposit = await parameterizer.get('pMinDeposit')
      expect(deposit).toBe('100')
      const applicantFinalBalance = await eip20.balanceOf(accounts[0])
      expect(maybeParseInt(applicantFinalBalance)).toBe((maybeParseInt(applicantStartingBalance)) - (maybeParseInt(deposit)))
    })
  })
})
