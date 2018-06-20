"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class default_1 {
    /**
     * An optional passed in account will become the default account for transactions for this contract.
     * The same as calling `setDefaultAccount(account)`
     */
    constructor(account) { account && this.setDefaultAccount(account); }
    /**
     * Given an instantiated web3 instance and some params -  deploy this contract.
     * The deploy params are prepared by the subclass then passed here.
     * Contract options are optionally passed from the original caller.
     */
    deployContract(web3, params, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts);
            this.deployed = yield new web3.eth.Contract(params.abi, undefined, { gas: opts && opts.gas || constants_1.GAS, gasPrice: opts && opts.gasPrice || constants_1.GAS_PRICE })
                // it appears web3 is unhappy getting falsy in the no-args case, so we pass an empty array
                // TODO PR a correction
                .deploy({ data: params.bytecode, arguments: params.args || [] })
                .send({ from: account });
            // TODO TransactionReceipt for the above deploy as return rather than the address?
            return this.deployed.options.address;
        });
    }
    getAddress() {
        const deployed = this.requireDeployed();
        return deployed.options.address;
    }
    getDeployed() { return this.deployed; }
    /**
     * Given the name of a solidity event, return the subscription object for it. These
     * objects are event emitters with an `on` method which accepts:
     * * `data`
     * * `change`
     * * `error`
     * see the web3 @types EventEmitter
     */
    getEventEmitter(name, opts) {
        const emitter = this.requireEmitter(name, opts);
        return emitter;
    }
    requireAccount(opts) {
        const account = opts && opts.from || this.defaultAccount;
        if (!account)
            throw constants_1.Errors.NO_ACCOUNT_AVAILABLE;
        return account;
    }
    requireDeployed() {
        if (!this.deployed)
            throw constants_1.Errors.CONTRACT_NOT_DEPLOYED;
        return this.deployed;
    }
    requireEmitter(name, opts) {
        const deployed = this.requireDeployed();
        if (!deployed.events[name])
            throw constants_1.Errors.NO_SUCH_EVENT;
        return deployed.events[name](opts);
    }
    setDefaultAccount(acct) { this.defaultAccount = acct; }
    // TODO use one amongst http/ws/ipc providers? Union type?
    setProvider(provider) {
        const deployed = this.requireDeployed();
        deployed.setProvider(provider);
    }
}
exports.default = default_1;
