/// <reference types="web3" />
import Web3 from 'web3';
import { TransactionReceipt } from 'web3/types';
import { ContractOptions, AtParams, Erc20DeployParams } from '../interfaces';
import Deployable from '../abstracts/deployable';
import { Nos } from '../@types';
export default class  extends Deployable {
    allowance(owner: string, spender: string): Promise<Nos>;
    approve(web3: Web3, address: string, amount: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    at(web3: Web3, params: AtParams, opts?: ContractOptions): Promise<boolean>;
    balanceOf(address: string): Promise<Nos>;
    deploy(web3: Web3, params?: Erc20DeployParams, opts?: ContractOptions): Promise<string>;
    transfer(web3: Web3, address: string, amount: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
    transferFrom(web3: Web3, from: string, to: string, amount: Nos, opts?: ContractOptions): Promise<TransactionReceipt>;
}
