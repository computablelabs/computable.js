/*
 * TODO better define type defintions
 *   Types were previously exported in web3.beta.34, but were removed
 *   in web3.beta.36. Web3 types are not being exported from @types/web3, but
 *   the definitions are incomplete when compared to web3.beta.34.
 *
 */

declare module "web3/types" {
  interface Contract {
    [key: string]: any
  }

  interface EventEmitter {
    [key: string]: any
  }

  interface EventLog {
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

