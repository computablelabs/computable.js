import Web3 from 'web3'
import { Keyed, ContractOptions, DeployParams } from '../interfaces'
import Deployable from '../abstracts/deployable'
import tokenJson from '../../computable/build/contracts/EIP20.json'
import { Contract, TransactionReceipt } from '../../node_modules/web3/types.d'
import { Nos } from '../types'
import { Token, GAS, GAS_PRICE } from '../../src/constants'

/**
 * Note that the 3 "Vanity" properties are not mandatory, and me be unused by some implementations
 */
interface Eip20DeployParams {
  supply?:Nos; // Initial token amount
  name?:string; // Vanity name of this token
  decimals?:Nos; // Vanity number of decimal places to show
  symbol?:Nos; // Vanity shorthand for this token
}

export default class extends Deployable {
  /**
   * An amount of funds an owner has given a spender permission to use
   */
  async allowance(owner:string, spender:string): Promise<string> {
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
   * Retrun the number of decimals that should be shown by this token
   */
  async decimals(): Promise<Nos> {
    const deployed = this.requireDeployed()

    return deployed.methods.decimals().call()
  }

  /**
   * Pepare the deploy options, passing them along with the instantiated web3 and optional
   * contract options to the super class' deployContract method.
   * @see abstracts/deployable#deployContract
   */
  async deploy(web3:Web3, params:Eip20DeployParams = {}, opts?:ContractOptions): Promise<string> {
    const dp:DeployParams = {
      abi: tokenJson.abi,
      bytecode: tokenJson.bytecode,
      args:[
        params.supply || Token.supply,
        params.name || Token.name,
        params.decimals || Token.decimals,
        params.symbol || Token.symbol
      ]
    }

    return super.deployContract(web3, dp, opts)
  }

  /**
   * Retrun the vanity name of this token
   */
  async name(): Promise<string> {
    const deployed = this.requireDeployed()

    return deployed.methods.name().call()
  }

  /**
   * Retrun the vanity symbol of this token
   */
  async symbol(): Promise<string> {
    const deployed = this.requireDeployed()

    return deployed.methods.symbol().call()
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
