import Web3 from 'web3'
import { Contract } from 'web3/types'
// import { Nos } from '../@types'
import {
  Errors,
  GAS_PRICE,
  MIN_GAS,
  GAS_BUFFER,
} from '../constants'
import {
  Keyed,
  TransactOpts,
} from '../interfaces'

export default abstract class implements Keyed {
  [key:string]:any
  public account?:string
  public address?:string
  public abi?:any
  protected deployed?:Contract

  constructor(account?:string) {
    if (account) this.account = account
  }

  protected async at(w3:Web3, address:string, abi:any, opts?:TransactOpts): Promise<boolean> {
    const account = this.requireAccount(opts)
    this.address = address
    this.abi = abi
    this.deployed = await new w3.eth.Contract(abi, address)
    return !!this.deployed
  }

  protected assignTransactOpts(src:Keyed, opts?:TransactOpts): TransactOpts {
    const account = this.requireAccount(opts)

    if (opts) {
      src = Object.assign(src, opts)
    }

    if (!('from' in src)) src.from = account
    if (!('gasPrice' in src)) src.gasPrice = GAS_PRICE

    return src
  }

  getGas(method:string): number {
    if (!this.abi) throw Errors.NO_ABI_SET
    let gas = MIN_GAS

    for (let obj of this.abi) {
      if ('name' in obj && obj['name'] === method) {
        gas = obj['gas']
        break
      }
    }

    return gas + GAS_BUFFER
  }

  requireAccount(opts?:TransactOpts): string {
    const account = opts && opts.from || this.account
    if (!account) throw Errors.NO_ACCOUNT_AVAILABLE
    return account
  }

  requireDeployed(): Contract {
    if (!this.deployed) throw Errors.CONTRACT_NOT_DEPLOYED
    return this.deployed
  }
}
