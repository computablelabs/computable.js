import Web3 from 'web3'
import { TransactionReceipt } from 'web3/types.d'
import { GAS, GAS_PRICE, Errors } from '../constants'
import Deployable from '../abstracts/deployable'
import { Nos } from '../types'
import registryJson from '../../computable/build/contracts/Registry.json'
// TODO PR web3 to export these properly
import {
  Keyed,
  ContractOptions,
  RegistryDeployParams,
  DeployParams,
  AtParams,
  RegistryListing,
  Challenge
} from '../interfaces'

/**
 * Registry
 *
 * Publisher Interface:
 * -------------------
 * apply
 * withdraw
 * deposit
 * exit
 *
 * Token Holder Interface:
 * ----------------------
 * challenge
 * updateStatus
 *
 * Token Functions:
 * ----------------
 * claimReward
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
 * voterReward
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
   * Set our deployed refernce from an already deployed contract
   * @see abstracts/deployable#at
   */
  async at(web3:Web3, params:AtParams, opts?:ContractOptions): Promise<boolean> {
    const ap:AtParams = {
      address: params.address,
      abi: registryJson.abi,
      from: params.from,
    }

    return super.at(web3, ap, opts)
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
   * Called by voter to claim their reward for each completed vote. Must be preceded by call to updateStatus
   */
  async claimReward(challengeId:string, salt:Nos, opts?:ContractOptions): Promise<TransactionReceipt> {
    const account = this.requireAccount(opts),
      deployed = this.requireDeployed()
    return await deployed.methods.claimReward(challengeId, salt).send({from: account})
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
   * Allow the owner of a listing to increase their unstaked deposit
   * @param listing listing that msg.sender is the owner of
   * @param amount how much to increase by
   */
  async deposit(listing:string, amount:Nos, opts?:ContractOptions): Promise<TransactionReceipt> {
    const account = this.requireAccount(opts),
      deployed = this.requireDeployed()

    return await deployed.methods.deposit(listing, amount).send({ from: account })
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

  async getData(listing:string): Promise<string> {
    const deployed = this.requireDeployed()

    return await deployed.methods.getData(listing).call()
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

 /**
  * Return the voter's token reward for the given poll.
  */
  async voterReward(voter:string, challengeId:string, salt:Nos): Promise<Nos> {
    const deployed = this.requireDeployed()
    return await deployed.methods.voterReward(voter, challengeId, salt).call()
  }

  /**
   * Allows the owner of a listingHash to decrease their unstaked deposit.
   *
   * @param listing listing that msg.sender is the owner of
   * @param tokens The number of ERC20 tokens to withdraw from unstaked deposity
   */
  async withdraw(listing:string, tokens:Nos, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.withdraw(listing, tokens).send({ from: account })
  }
}
