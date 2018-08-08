import Web3 from 'web3';
import { Contract } from 'web3/types.d';
export declare function deployAttributeStore(web3: Web3, account: string): Promise<Contract>;
export declare function deployDll(web3: Web3, account: string): Promise<Contract>;
export declare function updateBytecode(bytecode: string, library: string, address: string): string;
