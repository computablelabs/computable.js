import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import EtherToken from '../src/contracts/ether-token'
import { Return } from '../src/@types'
import {
  deploy,
  readBytecode,
  call,
  transact,
  buildTransaction,
  signTransaction,
  sendRawTransaction,
  send
} from '../src/helpers'
import {
  Contract,
  Transaction,
  SignedTransaction,
  TransactionReceipt
} from 'web3/types'
import {
  ETHER_TOKEN_ABI,
  ONE_ETHER,
  ONE_GWEI,
  ONE_MWEI
} from  '../src/constants'

const provider:any = ganache.provider(),
  w3 = new Web3(provider),
  toBN = w3.utils.toBN,
  privateKey = '0xcd3376bb711cb332ee3fb2ca04c6a8b9f70c316fcdf7a1f44ef4c7999483295e',
  passphrase = 'password1234'

// we'll use the ether token contract to test the signing helpers (could be any contract)
let token:EtherToken,
  accounts:string[],
  account:string,
  deployed:Contract,
  built:Transaction,
  signed:SignedTransaction,
  sent:TransactionReceipt


describe('Signing helper functions', () => {
  beforeAll(async () => {
    accounts = await w3.eth.getAccounts()

    // deploy it...
    const bin:string = readBytecode('ethertoken')

    deployed = await deploy(w3, accounts[0], ETHER_TOKEN_ABI,
      bin, [])

    // now we can instantiate the HOC
    token = new EtherToken(accounts[0])
    await token.at(w3, deployed.options.address)
  })

  // assure that this private key fukery works first
  it('imports a new raw private key', async () => {
    const lenB4 = accounts.length
    //@ts-ignore:2554
    account = await w3.eth.personal.importRawKey(privateKey, passphrase)
    expect(account).toBeTruthy()
    const acc = await w3.eth.getAccounts()
    const lenAfter = acc.length
    expect(lenAfter > lenB4).toBe(true)
  })

  it('is setup properly', async () => {
    // hydrated accounts already have ETH
    const bal = toBN(await w3.eth.getBalance(accounts[0]))
    expect(bal.gt(toBN(0))).toBe(true)
    // the newly imported account has no funds...
    let userBal = toBN(await w3.eth.getBalance(account))
    expect(userBal.gt(toBN(0))).toBe(false)
    // transfer some funds to the new user account
    const tx = w3.eth.sendTransaction({
      from: accounts[0],
      to: account,
      value: ONE_ETHER,
      gas: 121000,
      gasPrice: '2000000000',
    })
    expect(tx).toBeTruthy()
    // user should have some eth now
    userBal = toBN(await w3.eth.getBalance(account))
    expect(userBal.gt(toBN(0))).toBe(true)

    // user has no ethertoken
    let tokenBal = toBN(await call(await token.balanceOf(account)))
    expect(tokenBal.gt(toBN(0))).toBe(false)
    // have account[0] deposit some eth 
    await transact(await token.deposit(ONE_GWEI))
    // Then transfer to account
    await transact(await token.transfer(account, ONE_GWEI))
    // should have bal now...
    tokenBal = toBN(await call(await token.balanceOf(account)))
    expect(tokenBal.gt(toBN(0))).toBe(true)
  })

  // NOTE: keeping this here as its a litmus test for the actual methods vs failure in web3/ganache
  xit('will use transfer', async () => {
    // unlock the new account first
    const unlocked = await w3.eth.personal.unlockAccount(account, passphrase, 60)
    // @ts-ignore:2345
    expect(unlocked).toBe(true)

    const rct:TransactionReceipt = await transact(
      await token.transfer(accounts[2], ONE_MWEI, {from: account}))
    expect(rct).toBeTruthy()
    console.log(rct)

    const acct2Bal = toBN(await call(await token.balanceOf(accounts[2])))
    expect(acct2Bal.eq(toBN(ONE_MWEI))).toBe(true)
  })

  it('can build a TX', async () => {
    // lets lock the user account
    // const locked = await w3.eth.personal.lockAccount(account)
    // expect(locked).toBe(true)
    // NOTE: must include chainId is a bug with web3 current beta and ganache
    const ret:Return = await token.transfer(accounts[2], ONE_MWEI, {to: token.address, from: account})
    // const est = await ret[0].estimateGas() is about 52k
    built = await buildTransaction(w3, ret)
    expect(built.from).toBe(account)
    expect(built.nonce).toBeTruthy()
    expect(built.data).toBeTruthy()
  })

  it('can sign a TX', async () => {
    signed = await signTransaction(w3, privateKey, built)
    expect(signed.v).toBeTruthy()
    expect(signed.r).toBeTruthy()
    expect(signed.s).toBeTruthy()
    expect(signed.rawTransaction).toBeTruthy()
  })

  it('can send(broadcast) a raw signed transaction', async () => {
    // target user has no funds until tx is mined
    let acct2Bal = toBN(await call(await token.balanceOf(accounts[2])))
    expect(acct2Bal.eq(toBN(ONE_MWEI))).toBe(false)

    sent = await sendRawTransaction(w3, signed)
    expect(sent).toBeTruthy()
    expect(sent.status).toBe(true)

    // other user should have the funds now
    acct2Bal = toBN(await call(await token.balanceOf(accounts[2])))
    expect(acct2Bal.eq(toBN(ONE_MWEI))).toBe(true)
  })
})
