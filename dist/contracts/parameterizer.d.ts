import Web3 from 'web3';
import { TransactionReceipt } from 'web3/types.d';
import Deployable from '../abstracts/deployable';
import { Nos } from '../types';
import { ContractOptions, AtParams, ParameterizerDeployParams, ParameterizerProposal } from '../interfaces';
/**
 * Parameterizer
 *
 * Token Holder Interface:
 * ----------------------
 * challengeReparameterization
 * claimReward
 * processProposal
 * proposeReparameterization
 *
 * Getters:
 * -------
 * canBeSet
 * challengeCanBeResolved
 * challengeWinnerReward
 * get
 * propExists
 * tokenClaims
 * voterReward
 *
 * Private:
 * -------
 * resolveChallenge
 * set
 */
export default class  extends Deployable {
    /**
     * Set our deployed refernce from an already deployed contract
     * @see abstracts/deployable#at
     */
    at(web3: Web3, params: AtParams, opts?: ContractOptions): Promise<boolean>;
    /**
     * Determines if a proposal passed its application stage without a challenge
     */
    canBeSet(propID: string): Promise<boolean>;
    /**
     * Determines whether the provided proposal ID has a challenge which can be resolved
     */
    challengeCanBeResolved(propID: string): Promise<boolean>;
    /**
     * Challenge a given proposal ID, and stake tokens to do so
     */
    challengeReparameterization(propID: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    /**
     * Pepare the deploy options, passing them along with the instantiated web3 and optional
     * contract options to the super class' _deploy method.
     * @see abstracts/deployable#deployContract
     */
    deploy(web3: Web3, params: ParameterizerDeployParams, opts?: ContractOptions): Promise<string>;
    /**
     * Fetch a given attribute as it is set on the deployed contract
     */
    get(attribute: string): Promise<Nos>;
    /**
     * For the given proposal ID, set it, resolve its challenge, or delete it depending on whether it can be set,
     * has a challenge which can be resolved, or if its "process by" date has passed
     */
    processProposal(propID: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    /**
     * Determines whether a proposal exists for the provided proposal ID
     */
    propExists(propID: string): Promise<boolean>;
    /**
     * Proposals map pollIDs to intended data change if poll passes
     */
    proposals(propID: string): Promise<ParameterizerProposal>;
    /**
     * Propose a change of the given attribute to the given value
     */
    proposeReparameterization(attribute: string, val: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
}
