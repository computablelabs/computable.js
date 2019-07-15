import Web3 from 'web3';
import { Contract } from 'web3/types';
export declare function deploy(w3: Web3, account: string, abi: any, bytecode: string, args?: any[]): Promise<Contract>;
export declare function readBytecode(name: string): string;
