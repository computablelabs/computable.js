import Web3 from 'web3'
import { Contract, Transaction, TransactionReceipt } from 'web3/types'
import {
  Keyed,
  TransactOpts,
} from '../interfaces'
import { Nos, Return } from '../@types'
import { GAS_PRICE } from '../constants'
import Deployed from '../abstracts/deployed'

/*
 * Base class for both Ether and Market Tokens
 */
export default class extends Deployed {
  async allowance(owner:string, spender:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('allowance')}, opts)
    return [await deployed.methods.allowance(owner, spender), assigned]
  }

  async approve(spender:string, amount:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('approve')}, opts)
    return [await deployed.methods.approve(spender, amount), assigned]
  }

  async balanceOf(owner:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('balanceOf')}, opts)
    return [await deployed.methods.balanceOf(owner), assigned]
  }

}
