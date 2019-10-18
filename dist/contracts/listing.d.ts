import Web3 from 'web3';
import { TransactOpts } from '../interfaces';
import { Nos, Return } from '../@types';
import Deployed from '../abstracts/deployed';
export default class extends Deployed {
    at(w3: Web3, address: string, opts?: TransactOpts): Promise<boolean>;
    isListed(hash: string, opts?: TransactOpts): Promise<Return>;
    withdrawFromListing(hash: string, amount: Nos, opts?: TransactOpts): Promise<Return>;
    list(hash: string, opts?: TransactOpts): Promise<Return>;
    getListing(hash: string, opts?: TransactOpts): Promise<Return>;
    resolveApplication(hash: string, opts?: TransactOpts): Promise<Return>;
    claimAccessReward(hash: string, opts?: TransactOpts): Promise<Return>;
    challenge(hash: string, opts?: TransactOpts): Promise<Return>;
    resolveChallenge(hash: string, opts?: TransactOpts): Promise<Return>;
    exit(hash: string, opts?: TransactOpts): Promise<Return>;
}
