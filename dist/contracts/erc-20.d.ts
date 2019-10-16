import { TransactOpts } from '../interfaces';
import { Nos, Return } from '../@types';
import Deployed from '../abstracts/deployed';
export default class extends Deployed {
    allowance(owner: string, spender: string, opts?: TransactOpts): Promise<Return>;
    approve(spender: string, amount: Nos, opts?: TransactOpts): Promise<Return>;
    balanceOf(owner: string, opts?: TransactOpts): Promise<Return>;
    decreaseAllowance(spender: string, amount: Nos, opts?: TransactOpts): Promise<Return>;
    getDecimals(opts?: TransactOpts): Promise<Return>;
    getSymbol(opts?: TransactOpts): Promise<Return>;
    increaseAllowance(spender: string, amount: Nos, opts?: TransactOpts): Promise<Return>;
    totalSupply(opts?: TransactOpts): Promise<Return>;
    transfer(to: string, amount: Nos, opts?: TransactOpts): Promise<Return>;
    transferFrom(source: string, to: string, amount: Nos, opts?: TransactOpts): Promise<Return>;
}
