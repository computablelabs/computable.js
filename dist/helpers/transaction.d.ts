import Web3 from 'web3';
import { Return } from '../@types';
import { Transaction, TransactionReceipt, SignedTransaction } from 'web3/types';
export declare function call(args: Return): Promise<any>;
export declare function transact(args: Return): Promise<TransactionReceipt>;
export declare function buildTransaction(w3: Web3, args: Return): Promise<Transaction>;
export declare function signTransaction(w3: Web3, privateKey: string, tx: Transaction): Promise<SignedTransaction>;
export declare function sendRawTransaction(w3: Web3, tx: SignedTransaction): Promise<TransactionReceipt>;
export declare function send(w3: Web3, privateKey: string, args: Return): Promise<TransactionReceipt>;
