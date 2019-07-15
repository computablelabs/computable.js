import Web3 from 'web3';
import { TransactOpts } from '../interfaces';
import { Nos, Return } from '../@types';
import Deployed from '../abstracts/deployed';
export default class extends Deployed {
    at(w3: Web3, address: string, opts?: TransactOpts): Promise<boolean>;
    setPrivileged(listing: string, opts?: TransactOpts): Promise<Return>;
    getPrivileged(opts?: TransactOpts): Promise<Return>;
    getHash(url: string, opts?: TransactOpts): Promise<Return>;
    getBackendAddress(opts?: TransactOpts): Promise<Return>;
    getBackendUrl(opts?: TransactOpts): Promise<Return>;
    setBackendUrl(url: string, opts?: TransactOpts): Promise<Return>;
    setDataHash(listing: string, data: string, opts?: TransactOpts): Promise<Return>;
    register(url: string, opts?: TransactOpts): Promise<Return>;
    resolveRegistration(hash: string, opts?: TransactOpts): Promise<Return>;
    requestDelivery(hash: string, amount: Nos, opts?: TransactOpts): Promise<Return>;
    getBytesPurchased(addr: string, opts?: TransactOpts): Promise<Return>;
    getDelivery(hash: string, opts?: TransactOpts): Promise<Return>;
    listingAccessed(listing: string, delivery: string, amount: Nos, opts?: TransactOpts): Promise<Return>;
    getBytesAccessed(hash: string, opts?: TransactOpts): Promise<Return>;
    delivered(delivery: string, url: string, opts?: TransactOpts): Promise<Return>;
}
