import Web3 from 'web3'
import { TransactOpts } from '../interfaces'
import { GAS_PRICE, MARKET_TOKEN_ABI } from '../constants'
import Erc20 from './erc-20'

import { Return } from '../@types'
import Deployed from '../abstracts/deployed'

export default class extends Erc20 {
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, MARKET_TOKEN_ABI, opts)
  }

  async setPrivileged(reserve:string, listing:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('setPrivileged')}, opts)
    return [await deployed.methods.setPrivileged(reserve, listing), assigned]
  }

  async getPrivileged(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getPrivileged')}, opts)
    return [await deployed.methods.getPrivileged(), assigned]
  }

  async hasPrivilege(addr:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('hasPrivilege')}, opts)
    return [await deployed.methods.hasPrivilege(addr), assigned]
  }
}
