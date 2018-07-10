import Web3 from 'web3';
import { Contract, EventEmitter } from 'web3/types.d';
import { Keyed, ContractOptions, DeployParams, AtParams, EventEmitterOptions } from '../interfaces';
export default abstract class  implements Keyed {
    [key: string]: any;
    defaultAccount?: string;
    protected deployed?: Contract;
    /**
     * An optional passed in account will become the default account for transactions for this contract.
     * The same as calling `setDefaultAccount(account)`
     */
    constructor(account?: string);
    /**
     * Similar to deployContract, but using the address of an already deployed instance.
     * Returns truthy if fetched
     *
     * TODO introduce try/catch error handling
     */
    protected at(web3: Web3, params: AtParams, opts?: ContractOptions): Promise<boolean>;
    /**
     * Given an instantiated web3 instance and some params -  deploy this contract.
     * The deploy params are prepared by the subclass then passed here.
     * Contract options are optionally passed from the original caller.
     *
     * TODO introduce try/catch error handling
     */
    protected deployContract(web3: Web3, params: DeployParams, opts?: ContractOptions): Promise<string>;
    getAddress(): string;
    getDeployed(): Contract | undefined;
    /**
     * Given the name of a solidity event, return the subscription object for it. These
     * objects are event emitters with an `on` method which accepts:
     * * `data`
     * * `change`
     * * `error`
     * see the web3 @types EventEmitter
     */
    getEventEmitter(name: string, opts?: EventEmitterOptions): EventEmitter;
    requireAccount(opts?: ContractOptions): string;
    requireDeployed(): Contract;
    requireEmitter(name: string, opts?: EventEmitterOptions): EventEmitter;
    setDefaultAccount(acct: string): void;
    setProvider(provider: any): void;
}
