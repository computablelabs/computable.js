import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import { Token } from '../../../src/constants'
import { deployToken } from '../../helpers'

// TODO use the web3 IProvider?
const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[], eip20:Contract

describe('EIP20 Token', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = await deployToken(web3, accounts[0])
    eip20.setProvider(provider)
  })

  describe('Creation', () => {
    it('has a network address', async () => {
      const where = eip20.options.address
      expect(where).toBeTruthy()
    })

    it('gives initial balance to owner', async () => {
      const bal = await eip20.methods.balanceOf(accounts[0]).call()
      expect(parseInt(bal)).toBe(5000000)
    })

    it('sets vanity information correctly', async () => {
      const name = await eip20.methods.name().call(),
        sym = await eip20.methods.symbol().call(),
        decimals = await eip20.methods.decimals().call()

      expect(name).toBe(Token.name)
      expect(sym).toBe(Token.symbol)
      expect(parseInt(decimals)).toBe(Token.decimals)
    })
  })

  describe('Transfers', () => {
    it('transfers to another account', async () => {
      // spy on the event -- TODO when a fix for the web3 error is up...
      // const spy = { onTransfer: function(data) {} },
      // transferSpy = spyOn(spy, 'onTransfer').andCallThrough()
      // eip20.events.Transfer().on('data', spy.onTransfer)

      const result = await eip20.methods.transfer(accounts[1], 5000).send({ from: accounts[0] })
      expect(result.status).toBe(true)
      const senderBal = await eip20.methods.balanceOf(accounts[0]).call()
      expect(parseInt(senderBal)).toBe(4995000)
      const recieverBal = await eip20.methods.balanceOf(accounts[1]).call()
      expect(parseInt(recieverBal)).toBe(5000)
      // expect(transferSpy).toHaveBeenCalled()
    })
  })

  describe('Approvals', () => {
    it('sender approves account[1] for 1000', async () => {
      await eip20.methods.approve(accounts[1], 1000).send({ from: accounts[0] })
      const allowance = await eip20.methods.allowance(accounts[0], accounts[1]).call()
      expect(parseInt(allowance)).toBe(1000)
    })

    it('sender approves other account for 1000 and withdraws 200 once', async () => {
      await eip20.methods.approve(accounts[1], 1000).send({ from: accounts[0] })
      const allowance = await eip20.methods.allowance(accounts[0], accounts[1]).call()
      expect(parseInt(allowance)).toBe(1000)

      let acct2Bal = await eip20.methods.balanceOf(accounts[2]).call()
      expect(parseInt(acct2Bal)).toBe(0)

      const tx = await eip20.methods.transferFrom(accounts[0], accounts[2], 200).send({ from: accounts[1] })
      expect(tx.status).toBe(true)
      acct2Bal = await eip20.methods.balanceOf(accounts[2]).call()
      expect(parseInt(acct2Bal)).toBe(200)
      const acct0Bal = await eip20.methods.balanceOf(accounts[0]).call()
      expect(parseInt(acct0Bal)).toBe(4999800)
    })
  })
})
