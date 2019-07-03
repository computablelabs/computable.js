import Web3 from 'web3'
import { TransactOpts } from '../interfaces'
import { ETHER_TOKEN_ABI } from '../constants'
import { Nos, Return } from '../@types'
import Erc20 from './erc-20'

export default class extends Erc20 {
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, ETHER_TOKEN_ABI, opts)
  }

  async deposit(amount:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('deposit'), value: amount}, opts)
    return [await deployed.methods.deposit(amount), assigned]
  }

  async withdraw(amount:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('withdraw')}, opts)
    return [await deployed.methods.withdraw(amount), assigned]
  }
}
