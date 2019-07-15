import Web3 from 'web3';
import { TransactOpts } from '../interfaces';
import { Nos, Return } from '../@types';
import Erc20 from './erc-20';
export default class extends Erc20 {
    at(w3: Web3, address: string, opts?: TransactOpts): Promise<boolean>;
    deposit(amount: Nos, opts?: TransactOpts): Promise<Return>;
    withdraw(amount: Nos, opts?: TransactOpts): Promise<Return>;
}
