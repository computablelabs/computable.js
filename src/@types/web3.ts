/*
 * TODO better define type defintions
 * Web3 can be a bit hit-or-miss with its typedefs
 * override (or fulfull) them here
 *
 */

declare module "web3/types" {
  interface Contract {
    [key: string]: any
  }

  interface EventLog {
    [key: string]: any
  }

  interface Transaction {
    [key: string]: any
  }

  interface SignedTransaction {
    rawTransaction?: string
    [key: string]: any
  }

  interface TransactionReceipt {
    [key: string]: any
  }

  interface Block {
    [key: string]: any
  }

  type BlockType = "latest" | "pending" | "genesis" | number
}

