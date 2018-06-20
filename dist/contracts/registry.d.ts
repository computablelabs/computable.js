import Web3 from 'web3';
import { TransactionReceipt } from 'web3/types.d';
import Deployable from '../abstracts/deployable';
import { Nos } from '../types';
import { ContractOptions, RegistryDeployParams, RegistryListing, Challenge } from '../interfaces';
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
export default class  extends Deployable {
    /**
     * Allows a user to start an application. Takes tokens from user and sets apply stage end time.
     * @param listing The hash of a potential listing a user is applying to add to the registry
     * @param tokens The number of ERC20 tokens a user is willing to potentially stake
     * @param data Extra data relevant to the application. Think IPFS hashes.
     */
    apply(listing: string, tokens: Nos, data?: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    /**
     * Returns a bool that indicates if `apply` was called for a given listing hash
     */
    appWasMade(listing: string): Promise<boolean>;
    /**
     * Starts a poll for a listingHash which is either in the apply stage or already in the whitelist.
     * Tokens are taken from the challenger and the applicant's deposits are locked.
     * @param listing The hash being challenged, whether listed or in application
     * @param data Extra data relevant to the challenge. Think IPFS hashes.
     */
    challenge(listing: string, data?: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    /**
     * Return a challenge corresponding to the given challegeID.
     */
    challenges(challengeID: Nos): Promise<Challenge>;
    /**
     * Pepare the deploy options, passing them along with the instantiated web3 and optional
     * contract options to the super class' _deploy method.
     * @see abstracts/deployable#deployContract
     */
    deploy(web3: Web3, params: RegistryDeployParams, opts?: ContractOptions): Promise<string>;
    /**
     * Allows the owner of a listingHash to remove the listingHash from the whitelist
     * Returns all tokens to the owner of the listingHash
     * @param listing listing that msg.sender is the owner of
     */
    exit(listing: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    /**
     * Return a bool indicating if this listing has been whitelisted
     */
    isWhitelisted(listing: string): Promise<boolean>;
    /**
     * Return a listing corresponding to the given listing hash.
     */
    listings(listing: string): Promise<RegistryListing>;
    /**
     * Return the name passed to this contract instance at deploy time
     */
    name(): Promise<string>;
    /**
     * Return the address of the parameterizer referenced by this contract instance
     */
    parameterizer(): Promise<string>;
    /**
     * Return the address of the token referenced by this contract instance
     */
    token(): Promise<string>;
    /**
     * Updates a listingHash's status from 'application' to 'listing' or resolves a challenge if one exists.
     * Delegates to `whitelistApplication` or `resolveChallenge`
     */
    updateStatus(listing: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    /**
     * Return the address of the plcr-voting referenced by this contract instance
     */
    voting(): Promise<string>;
}
