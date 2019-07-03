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

  async decreaseApproval(spender:string, amount:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('decreaseApproval')}, opts)
    return [await deployed.methods.decreaseApproval(spender, amount), assigned]
  }

  async getDecimals(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('decimals')}, opts)
    return [await deployed.methods.decimals(), assigned]
  }

  async getSymbol(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('symbol')}, opts)
    return [await deployed.methods.symbol(), assigned]
  }

  async increaseApproval(spender:string, amount:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('increaseApproval')}, opts)
    return [await deployed.methods.increaseApproval(spender, amount), assigned]
  }

  async totalSupply(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('totalSupply')}, opts)
    return [await deployed.methods.totalSupply(), assigned]
  }

  async transfer(to:string, amount:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('transfer')}, opts)
    return [await deployed.methods.transfer(to, amount), assigned]
  }

  async transferFrom(source:string, to:string, amount:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('transferFrom')}, opts)
    return [await deployed.methods.transferFrom(source, to, amount), assigned]
  }
}
