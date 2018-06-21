import Web3 from 'web3';
import { Contract } from 'web3/types.d';
export declare function deployAttributeStore(web3: Web3, account: string): Promise<Contract>;
export declare function deployDll(web3: Web3, account: string): Promise<Contract>;
/**
 * Contracts that employ the solidity `using` feature for a `Library` will need their bytecode updated
 * with the deployed address of the stated "linked" library. We do that by searching and replacing the
 * bytecode string with the Ethereum standard (and poorly documented!) `__<Name>__*`. Note that placeholder
 * will always add up to exactly 40 chars. This means we need to slice off the first 2 (0x) chars of the
 * deployed address given to us.
 */
export declare function updateBytecode(bytecode: string, library: string, address: string): string;
