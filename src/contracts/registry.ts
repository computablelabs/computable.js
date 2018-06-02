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
  RegistryListing,
  Challenge
} from '../interfaces'

/**
 * Shape of the parameter object that should be passed to this class during a deploy.
 */
interface RegistryDeployParams {
  tokenAddress: string; // deployed address of the token that this contract references
  votingAddress: string; // deployed address of a PLCRVoting contract this contract references
  parameterizerAddress: string; // deployed address of a Parameterizer this contract references
  name: string; // The name of this registry
}

/**
 * Registry
 *
 * Publisher Interface:
 * -------------------
 * apply
 * exit
 *
 * Token Holder Interface:
 * ----------------------
 * challenge
 * updateStatus
 *
 * Getters:
 * -------
 * appWasMade
 * isWhitelisted
 * listings
 * challenges
 * name
 * parameterizer
 * token
 * voting
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
   * Returns a bool that indicates if `apply` was called for a given listing hash
   */
  async appWasMade(listing:string): Promise<boolean> {
    const deployed = this.requireDeployed()

    return deployed.methods.appWasMade(listing).call()
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
   * Return a challenge corresponding to the given challegeID.
   */
  async challenges(challengeID:Nos): Promise<Challenge> {
    const deployed = this.requireDeployed()

    return await deployed.methods.challenges(challengeID).call()
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
   * Allows the owner of a listingHash to remove the listingHash from the whitelist
   * Returns all tokens to the owner of the listingHash
   * @param listing listing that msg.sender is the owner of
   */
  async exit(listing:string, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.exit(listing).send({ from: account })
  }

  /**
   * Return a bool indicating if this listing has been whitelisted
   */
  async isWhitelisted(listing:string): Promise<boolean> {
    const deployed = this.requireDeployed()

    return await deployed.methods.isWhitelisted(listing).call()
  }

  /**
   * Return a listing corresponding to the given listing hash.
   */
  async listings(listing:string): Promise<RegistryListing> {
    const deployed = this.requireDeployed()

    return await deployed.methods.listings(listing).call()
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
   * Updates a listingHash's status from 'application' to 'listing' or resolves a challenge if one exists.
   * Delegates to `whitelistApplication` or `resolveChallenge`
   */
  async updateStatus(listing:string, opts?:ContractOptions): Promise<TransactionReceipt> {
    const account = this.requireAccount(opts),
      deployed = this.requireDeployed()

    return await deployed.methods.updateStatus(listing).send({ from: account })
  }

  /**
   * Return the address of the plcr-voting referenced by this contract instance
   */
  async voting(): Promise<string> {
    const deployed = this.requireDeployed()

    return await deployed.methods.voting().call()
  }
}
