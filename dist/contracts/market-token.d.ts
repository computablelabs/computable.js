import Web3 from 'web3';
import { TransactOpts } from '../interfaces';
import Erc20 from './erc-20';
import { Return } from '../@types';
export default class extends Erc20 {
    at(w3: Web3, address: string, opts?: TransactOpts): Promise<boolean>;
    setPrivileged(reserve: string, listing: string, opts?: TransactOpts): Promise<Return>;
    getPrivileged(opts?: TransactOpts): Promise<Return>;
    hasPrivilege(addr: string, opts?: TransactOpts): Promise<Return>;
}
