import Web3 from 'web3'
import { Errors } from '../constants'
import { Return } from '../@types'
import {
  Transaction,
  TransactionReceipt,
  SignedTransaction,
} from 'web3/types'

/*
 * Constant type functions are wrapped with `call`.
 * @param args A Return from an HOC method
 * @returns The TX reciept
 */
export function call(args:Return): Promise<any> {
  return args[0].call(args[1])
}

/*
 * If working with unlocked account(s) you can simply wrap a Return with `transact`
 * which delegates to the web3 `send`
 * @param args An HOC Return
 * @returns The TX receipt
 */
export function transact(args:Return): Promise<TransactionReceipt> {
  return args[0].send(args[1])
}

export async function buildTransaction(w3:Web3, args:Return): Promise<Transaction> {
  if (!args[1].from) throw Errors.NO_ACCOUNT_AVAILABLE

  const encoded = args[0].encodeABI()
  const count = await w3.eth.getTransactionCount(args[1].from)
  const built = Object.assign(args[1], {
    nonce: w3.utils.toHex(count),
    data: encoded,
  })
  return built
}

export async function signTransaction(w3:Web3, privateKey:string, tx:Transaction): Promise<SignedTransaction> {
  return w3.eth.accounts.signTransaction(tx, privateKey)
}

export async function sendRawTransaction(w3:Web3, tx:SignedTransaction): Promise<TransactionReceipt> {
  if (!tx.rawTransaction) throw Errors.NO_RAW_TRANSACTION
  return w3.eth.sendSignedTransaction(tx.rawTransaction)
}

export async function send(w3:Web3, privateKey:string, args:Return): Promise<TransactionReceipt> {
  const built = await buildTransaction(w3, args)
  const signed = await signTransaction(w3, privateKey, built)
  return sendRawTransaction(w3, signed)
}
