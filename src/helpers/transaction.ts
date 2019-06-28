import Web3 from 'web3'
import { TransactionReceipt } from 'web3/types'
import { Return } from '../@types'

/*
 * Constant type functions are wrapped with `call`.
 * @param args A Return from an HOC method
 * @returns The TX reciept
 */
export function call(args:Return): Promise<TransactionReceipt> {
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
