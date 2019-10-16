import Web3 from 'web3'
import { TransactOpts } from '../interfaces'
import { LISTING_ABI } from '../constants'
import { Nos, Return } from '../@types'
import Deployed from '../abstracts/deployed'

export default class extends Deployed {
  /**
   * Set our deployed refernce from an already deployed listng contract
   * @see abstracts/deployable#at
   */
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, LISTING_ABI, opts)
  }

  async isListed(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('isListed')}, opts)
    return [await deployed.methods.isListed(hash), assigned]
  }

  async withdrawFromListing(hash:string, amount:Nos, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('withdrawFromListing')}, opts)
    return [await deployed.methods.withdrawFromListing(hash, amount), assigned]
  }

  async list(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('list')}, opts)
    return [await deployed.methods.list(hash), assigned]
  }

  async getListing(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('getListing')}, opts)
    return [await deployed.methods.getListing(hash), assigned]
  }

  async resolveApplication(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('resolveApplication')}, opts)
    return [await deployed.methods.resolveApplication(hash), assigned]
  }

  async claimAccessReward(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('claimAccessReward')}, opts)
    return [await deployed.methods.claimAccessReward(hash), assigned]
  }

  async challenge(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('challenge')}, opts)
    return [await deployed.methods.challenge(hash), assigned]
  }

  async resolveChallenge(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('resolveChallenge')}, opts)
    return [await deployed.methods.resolveChallenge(hash), assigned]
  }

  async exit(hash:string, opts?:TransactOpts): Promise<Return> {
    const deployed = this.requireDeployed()
    let assigned = this.assignTransactOpts({gas: this.getGas('exit')}, opts)
    return [await deployed.methods.exit(hash), assigned]
  }
}
