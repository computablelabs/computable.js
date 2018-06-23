import Web3 from 'web3'
import { Contract, TransactionReceipt } from 'web3/types.d'
import {
  Keyed,
  ContractOptions,
  DeployParams,
  Erc20DeployParams,
} from '../interfaces'
import Deployable from '../abstracts/deployable'
import tokenJson from '../../computable/build/contracts/ConstructableToken.json'
import { Nos } from '../types'
import { Token, GAS, GAS_PRICE } from '../../src/constants'

export default class extends Deployable {
  /**
   * An amount of funds an owner has given a spender permission to use
   */
  async allowance(owner:string, spender:string): Promise<Nos> {
    const deployed = this.requireDeployed()

    return deployed.methods.allowance(owner, spender).call()
  }
  /**
   * Grant permission to a spender located at the given address to use up to the given amount of funds
   */
  async approve(address:string, amount:Nos, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.approve(address, amount).send({ from: account })
  }

  /**
   * Return the current balance of the given address
   */
  async balanceOf(address:string): Promise<Nos> {
    const deployed = this.requireDeployed()

    return await deployed.methods.balanceOf(address).call()
  }

  /**
   * Pepare the deploy options, passing them along with the instantiated web3 and optional
   * contract options to the super class' deployContract method.
   * @see abstracts/deployable#deployContract
   */
  async deploy(web3:Web3, params:Erc20DeployParams = {}, opts?:ContractOptions): Promise<string> {
    const dp:DeployParams = {
      abi: tokenJson.abi,
      bytecode: tokenJson.bytecode,
      args:[
        params.address || this.defaultAccount,
        params.supply || Token.supply
      ]

    }

    return super.deployContract(web3, dp, opts)
  }

  /**
   * Move the given number of funds from the msg.sender to a given address
   */
  async transfer(address:string, amount:Nos, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.transfer(address, amount).send({ from: account })
  }

  /**
   * Move the given number of funds from one given address to another given address
   */
  async transferFrom(from:string, to:string, amount:Nos, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.transferFrom(from, to, amount).send({ from: account })
  }
}
