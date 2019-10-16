import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from 'web3/types'
import EtherToken from '../../src/contracts/ether-token'
import { ETHER_TOKEN_ABI, ONE_ETHER, ONE_GWEI } from  '../../src/constants'
import { Return } from '../../src/@types'
import {
  deploy,
  readBytecode,
  call,
  transact,
} from '../../src/helpers'

const provider:any = ganache.provider(),
  w3 = new Web3(provider),
  toBN = w3.utils.toBN

let etherToken:EtherToken,
  accounts:string[],
  deployed:Contract,
  instantiated:boolean

describe('EtherToken', () => {
  beforeAll(async () => {
    accounts = await w3.eth.getAccounts()

    // deploy it...
    const bin:string = readBytecode('ethertoken')

    deployed = await deploy(w3, accounts[0], ETHER_TOKEN_ABI,
      bin, [])

    // now we can instantiate the HOC
    etherToken = new EtherToken(accounts[0])
    instantiated = await etherToken.at(w3, deployed.options.address)
  })

  describe('Creation', () => {
    it('has been instantiated', async () => {
      expect(etherToken.account).toBe(accounts[0])
      expect(etherToken.address).toBeTruthy()
      expect(etherToken.abi).toBeTruthy()
    })

  })

  describe('Deposit', () => {
    it('funds have been deposited', async () => {
      const origBal = toBN(await call(await etherToken.balanceOf(accounts[0])))
      expect(origBal.toString()).toBe('0')
      await transact(await etherToken.deposit(ONE_ETHER, {from: accounts[0]}))
      const newBal = toBN(await call(await etherToken.balanceOf(accounts[0])))
      expect(newBal.toString()).toBe(ONE_ETHER)
    })

  })

  describe('Transfers', () => {
    xit('transfers to another account', async () => {
      // const tx = await transact(await etherToken.transfer(accounts[1], ONE_GWEI))
      // TODO PR to web3 TS type here as they have `status` as string only in the TX Receipt definition.
      // Remove the !! when merged
      // expect(!!result.status).toBe(true)
      // const senderBal = await erc20.balanceOf(accounts[0])
      // expect(maybeParseInt(senderBal)).toBe(4995000)
      // const recieverBal = await erc20.balanceOf(accounts[1])
      // expect(maybeParseInt(recieverBal)).toBe(5000)
      // expect(transferSpy).toHaveBeenCalled()
    })
  })

  describe('Approvals', () => {
    it('can fetch gas cost for an approval', async () => {
      const cost = etherToken.getGas('approve')
      expect(cost).toBeTruthy()
    })

    it('approves account[1] for an amount', async () => {
      await transact(await etherToken.approve(accounts[1], ONE_GWEI))
      const allowance = toBN(await call(await etherToken.allowance(accounts[0], accounts[1])))
      expect(allowance.toString()).toBe(ONE_GWEI)
    })

    xit('sender approves other account for X and withdraws Y once', async () => {
      // await erc20.approve(web3, accounts[1], 1000)
      // const allowance = await erc20.allowance(accounts[0], accounts[1])
      // expect(maybeParseInt(allowance)).toBe(1000)

      // let acct2Bal = await erc20.balanceOf(accounts[2])
      // expect(maybeParseInt(acct2Bal)).toBe(0)

      // const tx = await erc20.transferFrom(web3, accounts[0], accounts[2], 200, { from: accounts[1] })
      // // TODO same as above
      // expect(!!tx.status).toBe(true)
      // acct2Bal = await erc20.balanceOf(accounts[2])
      // expect(maybeParseInt(acct2Bal)).toBe(200)
      // const acct0Bal = await erc20.balanceOf(accounts[0])
      // expect(maybeParseInt(acct0Bal)).toBe(4999800)
    })
  })
})
