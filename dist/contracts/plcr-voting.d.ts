import Web3 from 'web3';
import { TransactionReceipt } from 'web3/types.d';
import Deployable from '../abstracts/deployable';
import { Nos } from '../types';
import { ContractOptions, VotingDeployParams, AtParams } from '../interfaces';
export default class  extends Deployable {
    at(web3: Web3, params: AtParams, opts?: ContractOptions): Promise<boolean>;
    commitVote(web3: Web3, pollID: string, voter: string, vote: Nos, tokens: Nos, salt: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    deploy(web3: Web3, params: VotingDeployParams, opts?: ContractOptions): Promise<string>;
    getInsertPointForNumTokens(voter: string, tokens: Nos, pollID: string): Promise<Nos>;
    getVoteSaltHash(web3: Web3, vote: Nos, salt: Nos): string;
    requestVotingRights(tokens: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    withdrawVotingRights(tokens: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    revealVote(pollID: Nos, vote: Nos, salt: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    commitPeriodActive(pollID: Nos): Promise<boolean>;
    revealPeriodActive(pollID: Nos): Promise<boolean>;
}
