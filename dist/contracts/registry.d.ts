import Web3 from 'web3';
import { TransactionReceipt } from 'web3/types.d';
import Deployable from '../abstracts/deployable';
import { Nos } from '../types';
import { ContractOptions, RegistryDeployParams, AtParams, RegistryListing, Challenge } from '../interfaces';
export default class  extends Deployable {
    apply(web3: Web3, listing: string, tokens: Nos, data?: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    appWasMade(listing: string): Promise<boolean>;
    at(web3: Web3, params: AtParams, opts?: ContractOptions): Promise<boolean>;
    challenge(listing: string, data?: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    challenges(id: Nos): Promise<Challenge>;
    claimReward(id: Nos, salt: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    deploy(web3: Web3, params: RegistryDeployParams, opts?: ContractOptions): Promise<string>;
    deposit(listing: string, amount: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    exit(listing: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    isWhitelisted(listing: string): Promise<boolean>;
    listings(listing: string): Promise<RegistryListing>;
    name(): Promise<string>;
    parameterizer(): Promise<string>;
    token(): Promise<string>;
    updateStatus(listing: string, opts?: ContractOptions): Promise<TransactionReceipt>;
    voting(): Promise<string>;
    voterReward(voter: string, id: Nos, salt: Nos): Promise<Nos>;
    canBeWhitelisted(listing: string): Promise<boolean>;
    withdraw(listing: string, tokens: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
}
