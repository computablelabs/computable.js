import Web3 from 'web3'
import {  } from 'web3/types'

import {
  TransactOpts,
  Keyed
 } from '../interfaces'
import { GAS_PRICE, MARKET_TOKEN_ABI } from '../constants'
import Erc20 from './erc-20'

import { Nos, Return } from '../@types'
import Deployed from '../abstracts/deployed'

export default class extends Erc20 {
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, MARKET_TOKEN_ABI, opts)
  }

  async setPrivileged(listing:string, reserve:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('setPrivileged')}, opts)
    return [await deployed.methods.setPrivileged(listing, reserve), assigned]
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