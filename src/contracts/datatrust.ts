import Web3 from 'web3'
import {  } from 'web3/types'
import { TransactOpts } from '../interfaces'
import { DATATRUST_ABI } from '../constants'
import { Return } from '../@types'
import Deployed from '../abstracts/deployed'

export default class extends Deployed {
  /**
   * Set our deployed refernce from an already deployed contract
   * @see abstracts/deployable#at
   */
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, DATATRUST_ABI, opts)
  }

  async setPrivileged(listing:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('setPrivileged')}, opts)
    return [await deployed.methods.setPrivileged(listing), assigned]
  }

  async getPrivileged(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getPrivileged')}, opts)
    return [await deployed.methods.getPrivileged(), assigned]
  }

  async getHash(url:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getHash')}, opts)
    return [await deployed.methods.getHash(url), assigned]
  }

  async getBackendAddress(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getBackendAddress')}, opts)
    return [await deployed.methods.getBackendAddress(), assigned]
  }

  async getBackendUrl(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getBackendUrl')}, opts)
    return [await deployed.methods.getBackendUrl(), assigned]
  }

  async setBackendUrl(url:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('setBackendUrl')}, opts)
    return [await deployed.methods.setBackendUrl(url), assigned]
  }

  async setDataHash(listing:string, data:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('setDataHash')}, opts)
    return [await deployed.methods.setDataHash(listing, data), assigned]
  }

  async register(url:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('register')}, opts)
    return [await deployed.methods.register(url), assigned]
  }

  async resolveRegistration(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('resolveRegistration')}, opts)
    return [await deployed.methods.resolveRegistration(hash), assigned]
  }

  async requestDelivery(hash:string, amount:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('requestDelivery')}, opts)
    return [await deployed.methods.requestDelivery(hash, amount), assigned]
  }

  async getBytesPurchased(addr:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getBytesPurchased')}, opts)
    return [await deployed.methods.getBytesPurchased(addr), assigned]
  }

  async getDelivery(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getDelivery')}, opts)
    return [await deployed.methods.getDelivery(hash), assigned]
  }

  async listingAccessed(listing:string, delivery:string, amount:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('listingAccessed')}, opts)
    return [await deployed.methods.listingAccessed(listing, delivery, amount), assigned]
  }

  async getBytesAccessed(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getBytesAccessed')}, opts)
    return [await deployed.methods.getBytesAccessed(hash), assigned]
  }

  async delivered(delivery:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('delivered')}, opts)
    return [await deployed.methods.delivered(delivery), assigned]
  }
}
