import Web3 from 'web3'
import { GAS, GAS_PRICE, Errors } from '../constants'
import Deployable from '../abstracts/deployable'
import { Nos } from '../types'
import registryJson from '../../computable/build/contracts/Registry.json'
// TODO PR web3 to export these properly
import { TransactionReceipt } from '../../node_modules/web3/types.d'
import {
  Keyed,
  ContractOptions,
  DeployParams,
} from '../interfaces'

/**
 * Shape of the parameter object that should be passed to this class during a deploy.
 */
interface RegistryDeployParams {
  tokenAddress: string;
  votingAddress: string;
  parameterizerAddress: string;
  name: string;
}

/**
 * Registry
 *
 * Token Holder Interface:
 * ----------------------
 * apply
 *
 * Getters:
 * -------
 * name
 * parameterizer
 * token
 * voting
 *
 */

export default class extends Deployable {
  /**
   * Allows a user to start an application. Takes tokens from user and sets apply stage end time.
   * @param listing The hash of a potential listing a user is applying to add to the registry
   * @param tokens The number of ERC20 tokens a user is willing to potentially stake
   * @param data Extra data relevant to the application. Think IPFS hashes.
   */
  async apply(listing:string, tokens:Nos, data:string = '', opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.apply(listing, tokens, data).send({ from: account })
  }

  /**
   * Starts a poll for a listingHash which is either in the apply stage or already in the whitelist.
   * Tokens are taken from the challenger and the applicant's deposits are locked.
   * @param listing The hash being challenged, whether listed or in application
   * @param data Extra data relevant to the challenge. Think IPFS hashes.
   */
  async challenge(listing:string, data:string = '', opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.challenge(listing, data).send({ from: account })
  }

  /**
   * Pepare the deploy options, passing them along with the instantiated web3 and optional
   * contract options to the super class' _deploy method.
   * @see abstracts/deployable#deployContract
   */
  async deploy(web3:Web3, params:RegistryDeployParams, opts?:ContractOptions): Promise<string> {
    const dp:DeployParams = {
      abi: registryJson.abi,
      bytecode: registryJson.bytecode,
      args:[
        params.tokenAddress,
        params.votingAddress,
        params.parameterizerAddress,
        params.name
      ]
    }

    return super.deployContract(web3, dp, opts)
  }

  /**
   * Return the name passed to this contract instance at deploy time
   */
  async name(): Promise<string> {
    const deployed = this.requireDeployed()

    return await deployed.methods.name().call()
  }

  /**
   * Return the address of the parameterizer referenced by this contract instance
   */
  async parameterizer(): Promise<string> {
    const deployed = this.requireDeployed()

    return await deployed.methods.parameterizer().call()
  }

  /**
   * Return the address of the token referenced by this contract instance
   */
  async token(): Promise<string> {
    const deployed = this.requireDeployed()

    return await deployed.methods.token().call()
  }

  /**
   * Return the address of the plcr-voting referenced by this contract instance
   */
  async voting(): Promise<string> {
    const deployed = this.requireDeployed()

    return await deployed.methods.voting().call()
  }
}
