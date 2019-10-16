import Web3 from 'web3';
import { TransactOpts } from '../interfaces';
import { Nos, Return } from '../@types';
import Deployed from '../abstracts/deployed';
export default class extends Deployed {
    at(w3: Web3, address: string, opts?: TransactOpts): Promise<boolean>;
    setPrivileged(parameterizer: string, datatrust: string, listing: string, opts?: TransactOpts): Promise<Return>;
    getPrivileged(opts?: TransactOpts): Promise<Return>;
    hasPrivilege(addr: string, opts?: TransactOpts): Promise<Return>;
    candidateIs(hash: string, kind: Nos, opts?: TransactOpts): Promise<Return>;
    isCandidate(hash: string, opts?: TransactOpts): Promise<Return>;
    getCandidate(hash: string, opts?: TransactOpts): Promise<Return>;
    getCandidateOwner(hash: string, opts?: TransactOpts): Promise<Return>;
    didPass(hash: string, plurality: Nos, opts?: TransactOpts): Promise<Return>;
    vote(hash: string, option: Nos, opts?: TransactOpts): Promise<Return>;
    getStake(hash: string, address: string, opts?: TransactOpts): Promise<Return>;
    unstake(hash: string, opts?: TransactOpts): Promise<Return>;
}
