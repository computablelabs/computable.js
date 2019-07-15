import Web3 from 'web3';
import { TransactOpts } from '../interfaces';
import { Nos, Return } from '../@types';
import Deployed from '../abstracts/deployed';
export default class extends Deployed {
    at(w3: Web3, address: string, opts?: TransactOpts): Promise<boolean>;
    getBackendPayment(opts?: TransactOpts): Promise<Return>;
    getMakerPayment(opts?: TransactOpts): Promise<Return>;
    getReservePayment(opts?: TransactOpts): Promise<Return>;
    getCostPerByte(opts?: TransactOpts): Promise<Return>;
    getStake(opts?: TransactOpts): Promise<Return>;
    getPriceFloor(opts?: TransactOpts): Promise<Return>;
    getHash(param: Nos, value: Nos, opts?: TransactOpts): Promise<Return>;
    getSpread(opts?: TransactOpts): Promise<Return>;
    getListReward(opts?: TransactOpts): Promise<Return>;
    getPlurality(opts?: TransactOpts): Promise<Return>;
    getReparam(hash: string, opts?: TransactOpts): Promise<Return>;
    getVoteBy(opts?: TransactOpts): Promise<Return>;
    reparameterize(param: Nos, value: Nos, opts?: TransactOpts): Promise<Return>;
    resolveReparam(hash: string, opts?: TransactOpts): Promise<Return>;
}
