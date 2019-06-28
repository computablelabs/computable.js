import Web3 from 'web3'
import { Contract, Transaction, TransactionReceipt } from 'web3/types'
import {
  Keyed,
  TransactOpts,
} from '../interfaces'
import { Nos, Return } from '../@types'
import { GAS_PRICE } from '../constants'
import Deployed from '../abstracts/deployed'

export default class extends Deployed {
  async balanceOf(owner:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('balanceOf')}, opts)
    return [await deployed.methods.balanceOf(owner), assigned]
  }
}
