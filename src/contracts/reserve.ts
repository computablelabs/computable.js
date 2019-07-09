import Web3 from 'web3'
import {  } from 'web3/types'
import { TransactOpts } from '../interfaces'
import { RESERVE_ABI } from '../constants'
import { Return } from '../@types'
import Deployed from '../abstracts/deployed'

export default class extends Deployed {
  /**
   * Set our deployed refernce from an already deployed contract
   * @see abstracts/deployable#at
   */
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, RESERVE_ABI, opts)
  }

  async getSupportPrice(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getSupportPrice')}, opts)
    return [await deployed.methods.getSupportPrice(), assigned]
  }

  async support(offer:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('support')}, opts)
    return [await deployed.methods.support(offer), assigned]
  }

  async getWithdrawalProceeds(address:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getWithdrawalProceeds')}, opts)
    return [await deployed.methods.getWithdrawalProceeds(address), assigned]
  }

  async withdraw(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('withdraw')}, opts)
    return [await deployed.methods.withdraw(), assigned]
  }
}
