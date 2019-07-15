import Web3 from 'web3';
import { Contract } from 'web3/types';
import { Keyed, TransactOpts } from '../interfaces';
export default abstract class implements Keyed {
    [key: string]: any;
    account?: string;
    address?: string;
    abi?: any;
    protected deployed?: Contract;
    constructor(account?: string);
    protected at(w3: Web3, address: string, abi: any, opts?: TransactOpts): Promise<boolean>;
    assignTransactOpts(src: Keyed, opts?: TransactOpts): TransactOpts;
    getGas(method: string): number;
    requireAccount(opts?: TransactOpts): string;
    requireDeployed(): Contract;
}
