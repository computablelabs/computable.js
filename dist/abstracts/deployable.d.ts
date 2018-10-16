/// <reference types="web3" />
import Web3 from 'web3';
import { Contract, EventEmitter } from 'web3/types';
import { Keyed, ContractOptions, DeployParams, AtParams, EventEmitterOptions } from '../interfaces';
export default abstract class  implements Keyed {
    [key: string]: any;
    defaultAccount?: string;
    protected deployed?: Contract;
    constructor(account?: string);
    protected assignContractOptions(src: Keyed, opts?: ContractOptions): ContractOptions;
    protected at(web3: Web3, params: AtParams, opts?: ContractOptions): Promise<boolean>;
    protected deployContract(web3: Web3, params: DeployParams, opts?: ContractOptions): Promise<string>;
    getAddress(): string;
    getDeployed(): Contract | undefined;
    getEventEmitter(name: string, opts?: EventEmitterOptions): EventEmitter;
    requireAccount(opts?: ContractOptions): string;
    requireDeployed(): Contract;
    requireEmitter(name: string, opts?: EventEmitterOptions): EventEmitter;
    setDefaultAccount(acct: string): void;
    setProvider(provider: any): void;
}
