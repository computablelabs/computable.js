/// <reference types="web3" />
import Web3 from 'web3';
import { TransactionReceipt } from 'web3/types';
import { Nos } from '../@types';
import { ContractOptions } from '../interfaces';
export declare function maybeParseInt(arg: Nos, radix?: number): number;
export declare function increaseTime(provider: any, seconds: number): Promise<any>;
export declare function stringToBytes(web3: Web3, str: string): string;
export declare function sendSignedTransaction(web3: Web3, to: string, from: string, encoded: string, opts: ContractOptions): Promise<TransactionReceipt>;
