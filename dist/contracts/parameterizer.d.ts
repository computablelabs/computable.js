import Web3 from 'web3';
import { TransactionReceipt } from 'web3/types.d';
import Deployable from '../abstracts/deployable';
import { Nos } from '../@types';
import { ContractOptions, AtParams, ParameterizerDeployParams, ParameterizerProposal } from '../interfaces';
export default class  extends Deployable {
    at(web3: Web3, params: AtParams, opts?: ContractOptions): Promise<boolean>;
    canBeSet(propID: string): Promise<boolean>;
    challengeCanBeResolved(propID: string): Promise<boolean>;
    challengeReparameterization(propID: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    deploy(web3: Web3, params: ParameterizerDeployParams, opts?: ContractOptions): Promise<string>;
    get(attribute: string): Promise<Nos>;
    processProposal(propID: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    propExists(propID: string): Promise<boolean>;
    proposals(propID: string): Promise<ParameterizerProposal>;
    proposeReparameterization(attribute: string, val: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
}
