import Web3 from 'web3';
import { TransactOpts } from '../interfaces';
import { Nos, Return } from '../@types';
import Deployed from '../abstracts/deployed';
export default class extends Deployed {
    at(w3: Web3, address: string, opts?: TransactOpts): Promise<boolean>;
    getSupportPrice(opts?: TransactOpts): Promise<Return>;
    support(offer: Nos, opts?: TransactOpts): Promise<Return>;
    getWithdrawalProceeds(address: string, opts?: TransactOpts): Promise<Return>;
    withdraw(opts?: TransactOpts): Promise<Return>;
}
