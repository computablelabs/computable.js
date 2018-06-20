import Web3 from 'web3';
import { TransactionReceipt } from 'web3/types.d';
import Deployable from '../abstracts/deployable';
import { Nos } from '../types';
import { ContractOptions, VotingDeployParams } from '../interfaces';
/**
 * PLCR Voting
 */
export default class  extends Deployable {
    /**
     * Commits vote using a created hash with secret salt to conceal vote until reveal
     */
    commitVote(web3: Web3, pollID: string, voter: string, vote: Nos, tokens: Nos, salt: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    /**
     * Pepare the deploy options, passing them along with the instantiated web3 and optional
     * contract options to the super class' _deploy method.
     * @see abstracts/deployable#_deploy
     */
    deploy(web3: Web3, params: VotingDeployParams, opts?: ContractOptions): Promise<string>;
    /**
     * Takes the last node in the user's DLL and iterates backwards through the list searching
     * for a node with a value less than or equal to the provided tokens value. When such a node
     * is found, if the provided pollID matches the found nodeID, this operation is an in-place
     * update. In that case, return the previous node of the node being updated. Otherwise return the
     * first node that was found with a value less than or equal to the provided tokens.
     */
    getInsertPointForNumTokens(voter: string, tokens: Nos, pollID: string): Promise<Nos>;
    /**
     * return a sha3 hash of the vote and salt values
     */
    getVoteSaltHash(web3: Web3, vote: Nos, salt: Nos): string;
    /**
     * Loads a number of ERC20 tokens into the voting contract for one-to-one voting rights.
     * Assumes that `account` has approved the voting contract to spend on their behalf.
     */
    requestVotingRights(tokens: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    /**
     * Reveals vote cast and secret salt used in generating commitHash to attribute committed tokens
     */
    revealVote(pollID: Nos, vote: Nos, salt: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
}
