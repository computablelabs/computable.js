import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import json from '../../../computable/build/contracts/EIP20.json'
import { Token } from '../../../src/constants'

// TODO use the web3 IProvider?
const provider:any = ganache.provider()

const web3 = new Web3(provider)

let accounts:string[], eip20:Contract

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  eip20 = await new web3.eth.Contract(json.abi)
    .deploy({ data: json.bytecode, arguments: [
      Token.supply,
      Token.name,
      Token.decimals,
      Token.symbol
    ]})
    .send({ from: accounts[0], gas: '5000000' }) // NOTE watch the gas limit here

  eip20.setProvider(provider)
})

describe('EIP20 Token', () => {
  describe('Creation', () => {
    it('gives initial balance to owner', async () => {
      const bal = await eip20.methods.balanceOf(accounts[0]).call()
      expect(parseInt(bal)).toBe(10000)
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
      // spy on the event
      // const spy = { onTransfer: function() {} },
        // transferSpy = spyOn(spy, 'onTransfer')
      const emitter = eip20.events.Transfer(undefined, (err, evt) => { console.log(err) })
        .on('data', (log) => {
          console.log(log)
        })

      const result = await eip20.methods.transfer(accounts[1], 5000).send({ from: accounts[0] })
      expect(result.status).toBe(true)
      const senderBal = await eip20.methods.balanceOf(accounts[0]).call()
      expect(parseInt(senderBal)).toBe(5000)
      const recieverBal = await eip20.methods.balanceOf(accounts[1]).call()
      expect(parseInt(recieverBal)).toBe(5000)
      // expect(transferSpy).toHaveBeenCalled()
    })
  })
})
