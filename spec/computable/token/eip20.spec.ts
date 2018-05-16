import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Token } from '../../../src/constants'
import Eip20 from '../../../src/contracts/eip20'
import { maybeParseInt } from '../../../src/helpers'

// TODO use the web3 IProvider?
const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[], eip20:Eip20

describe('EIP20 Token', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = new Eip20(accounts[0])
    await eip20.deploy(web3)
    eip20.setProvider(provider)
  })

  describe('Creation', () => {
    it('has a network address', async () => {
      const where = eip20.getAddress()
      expect(where).toBeTruthy()
    })

    it('gives initial balance to owner', async () => {
      const bal = await eip20.balanceOf(accounts[0])
      expect(maybeParseInt(bal)).toBe(5000000)
    })

    it('sets vanity information correctly', async () => {
      const name = await eip20.name(),
        sym = await eip20.symbol()

      let decimals = await eip20.decimals()
      decimals = maybeParseInt(decimals)

      expect(name).toBe(Token.name)
      expect(sym).toBe(Token.symbol)
      expect(maybeParseInt(decimals)).toBe(maybeParseInt(Token.decimals))
    })
  })

  describe('Transfers', () => {
    it('transfers to another account', async () => {
      // spy on the event -- TODO when a fix for the web3 error is up...
      // const spy = { onTransfer: function(data) {} },
      // transferSpy = spyOn(spy, 'onTransfer').andCallThrough()
      // eip20.events.Transfer().on('data', spy.onTransfer)

      const result = await eip20.transfer(accounts[1], 5000)
      // TODO PR to web3 TS type here as they have `status` as string only in the TX Receipt definition.
      // Remove the !! when merged
      expect(!!result.status).toBe(true)
      const senderBal = await eip20.balanceOf(accounts[0])
      expect(maybeParseInt(senderBal)).toBe(4995000)
      const recieverBal = await eip20.balanceOf(accounts[1])
      expect(maybeParseInt(recieverBal)).toBe(5000)
      // expect(transferSpy).toHaveBeenCalled()
    })
  })

  describe('Approvals', () => {
    it('sender approves account[1] for 1000', async () => {
      await eip20.approve(accounts[1], 1000)
      const allowance = await eip20.allowance(accounts[0], accounts[1])
      expect(maybeParseInt(allowance)).toBe(1000)
    })

    it('sender approves other account for 1000 and withdraws 200 once', async () => {
      await eip20.approve(accounts[1], 1000)
      const allowance = await eip20.allowance(accounts[0], accounts[1])
      expect(maybeParseInt(allowance)).toBe(1000)

      let acct2Bal = await eip20.balanceOf(accounts[2])
      expect(maybeParseInt(acct2Bal)).toBe(0)

      const tx = await eip20.transferFrom(accounts[0], accounts[2], 200, { from: accounts[1] })
      // TODO same as above
      expect(!!tx.status).toBe(true)
      acct2Bal = await eip20.balanceOf(accounts[2])
      expect(maybeParseInt(acct2Bal)).toBe(200)
      const acct0Bal = await eip20.balanceOf(accounts[0])
      expect(maybeParseInt(acct0Bal)).toBe(4999800)
    })
  })
})
