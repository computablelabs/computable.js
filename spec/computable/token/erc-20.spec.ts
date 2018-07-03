import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Token } from '../../../src/constants'
import Erc20 from '../../../src/contracts/erc-20'
import { maybeParseInt } from '../../../src/helpers'

let server:any,
  provider:any,
  web3:Web3,
  accounts:string[],
  erc20:Erc20

describe('Erc20 Token', () => {
  beforeAll(() => {
    server = ganache.server({ws:true})
    server.listen(8544)

    provider = new Web3.providers.WebsocketProvider('ws://localhost:8544')
    web3 = new Web3(provider)
  })

  afterAll(() => {
    server.close()
    server = null
  })

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    erc20 = new Erc20(accounts[0])
    await erc20.deploy(web3)
    erc20.setProvider(provider)
  })

  describe('Creation', () => {
    it('has a network address', async () => {
      const where = erc20.getAddress()
      expect(where).toBeTruthy()
    })

    it('gives initial balance to owner', async () => {
      const bal = await erc20.balanceOf(accounts[0])
      expect(maybeParseInt(bal)).toBe(5000000)
    })

    it('can be initialized from an already deployed address', async () => {
      const address = erc20.getAddress(),
        other:Erc20 = new Erc20(accounts[0]),
        works = await other.at(web3, { address })

      expect(works).toBe(true)
      // should have the same bal...
      const bal = await other.balanceOf(accounts[0])
      expect(maybeParseInt(bal)).toBe(5000000)
    })
  })

  describe('Transfers', () => {
    it('transfers to another account', async () => {
      // spy on the event -- TODO when a fix for the web3 error is up...
      // const spy = { onTransfer: function(data) {} },
      // transferSpy = spyOn(spy, 'onTransfer').andCallThrough()
      // erc20.events.Transfer().on('data', spy.onTransfer)

      const result = await erc20.transfer(accounts[1], 5000)
      // TODO PR to web3 TS type here as they have `status` as string only in the TX Receipt definition.
      // Remove the !! when merged
      expect(!!result.status).toBe(true)
      const senderBal = await erc20.balanceOf(accounts[0])
      expect(maybeParseInt(senderBal)).toBe(4995000)
      const recieverBal = await erc20.balanceOf(accounts[1])
      expect(maybeParseInt(recieverBal)).toBe(5000)
      // expect(transferSpy).toHaveBeenCalled()
    })
  })

  describe('Approvals', () => {
    it('sender approves account[1] for 1000', async () => {
      await erc20.approve(accounts[1], 1000)
      const allowance = await erc20.allowance(accounts[0], accounts[1])
      expect(maybeParseInt(allowance)).toBe(1000)
    })

    it('sender approves other account for 1000 and withdraws 200 once', async () => {
      await erc20.approve(accounts[1], 1000)
      const allowance = await erc20.allowance(accounts[0], accounts[1])
      expect(maybeParseInt(allowance)).toBe(1000)

      let acct2Bal = await erc20.balanceOf(accounts[2])
      expect(maybeParseInt(acct2Bal)).toBe(0)

      const tx = await erc20.transferFrom(accounts[0], accounts[2], 200, { from: accounts[1] })
      // TODO same as above
      expect(!!tx.status).toBe(true)
      acct2Bal = await erc20.balanceOf(accounts[2])
      expect(maybeParseInt(acct2Bal)).toBe(200)
      const acct0Bal = await erc20.balanceOf(accounts[0])
      expect(maybeParseInt(acct0Bal)).toBe(4999800)
    })
  })
})
