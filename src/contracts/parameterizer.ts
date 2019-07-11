import Web3 from 'web3'
import {  } from 'web3/types'
import { TransactOpts } from '../interfaces'
import { PARAMETERIZER_ABI } from '../constants'
import { Nos, Return } from '../@types'
import Deployed from '../abstracts/deployed'

export default class extends Deployed {
  /**
   * Set our deployed refernce from an already deployed contract
   * @see abstracts/deployable#at
   */
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, PARAMETERIZER_ABI, opts)
  }

  async getBackendPayment(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getBackendPayment')}, opts)
    return [await deployed.methods.getBackendPayment(), assigned]
  }

  async getMakerPayment(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getMakerPayment')}, opts)
    return [await deployed.methods.getMakerPayment(), assigned]
  }

  async getReservePayment(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getReservePayment')}, opts)
    return [await deployed.methods.getReservePayment(), assigned]
  }

  async getCostPerByte(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getCostPerByte')}, opts)
    return [await deployed.methods.getCostPerByte(), assigned]
  }

  async getStake(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getStake')}, opts)
    return [await deployed.methods.getStake(), assigned]
  }

  async getPriceFloor(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getPriceFloor')}, opts)
    return [await deployed.methods.getPriceFloor(), assigned]
  }

  async getHash(param:Nos, value:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getHash')}, opts)
    return [await deployed.methods.getHash(param, value), assigned]
  }

  async getSpread(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getSpread')}, opts)
    return [await deployed.methods.getSpread(), assigned]
  }

  async getListReward(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getListReward')}, opts)
    return [await deployed.methods.getListReward(), assigned]
  }

  async getPlurality(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getPlurality')}, opts)
    return [await deployed.methods.getPlurality(), assigned]
  }

  async getReparam(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getReparam')}, opts)
    return [await deployed.methods.getReparam(hash), assigned]
  }

  async getVoteBy(opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getVoteBy')}, opts)
    return [await deployed.methods.getVoteBy(), assigned]
  }

  async reparameterize(param:Nos, value:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('reparameterize')}, opts)
    return [await deployed.methods.reparameterize(param, value), assigned]
  }

  async resolveReparam(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('resolveReparam')}, opts)
    return [await deployed.methods.resolveReparam(hash), assigned]
  }
}
