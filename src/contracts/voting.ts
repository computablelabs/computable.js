import Web3 from 'web3'
import { TransactOpts } from '../interfaces'
import { VOTING_ABI } from '../constants'
import { Nos, Return } from '../@types'
import Deployed from '../abstracts/deployed'

export default class extends Deployed {
  /**
   * Set our deployed refernce from an already deployed contract
   * @see abstracts/deployable#at
   */
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, VOTING_ABI, opts)
  }

  async setPrivileged(parameterizer:string, reserve:string, datatrust:string, listing:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('setPrivileged')}, opts)
    return [await deployed.methods.setPrivileged(parameterizer, reserve, datatrust, listing), assigned]
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

  async candidateIs(hash:string, kind:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('candidateIs')}, opts)
    return [await deployed.methods.candidateIs(hash, kind), assigned]
  }

  async isCandidate(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('isCandidate')}, opts)
    return [await deployed.methods.isCandidate(hash), assigned]
  }

  async getCandidate(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getCandidate')}, opts)
    return [await deployed.methods.getCandidate(hash), assigned]
  }

  async getCandidateOwner(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getCandidateOwner')}, opts)
    return [await deployed.methods.getCandidateOwner(hash), assigned]
  }

  async didPass(hash:string, plurality:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('didPass')}, opts)
    return [await deployed.methods.didPass(hash, plurality), assigned]
  }

  async vote(hash:string, option:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('vote')}, opts)
    return [await deployed.methods.vote(hash, option), assigned]
  }

  async getStake(hash:string, address:string,  opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getStake')}, opts)
    return [await deployed.methods.getStake(hash, address), assigned]
  }

  async unstake(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('unstake')}, opts)
    return [await deployed.methods.unstake(hash), assigned]
  }
}
