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
    constructor(account) { account && this.setDefaultAccount(account); }
    assignContractOptions(src, opts) {
        if (opts) {
            delete opts.sign;
            return Object.assign(opts, src);
        }
        return src;
    }
    at(web3, params, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts);
            this.deployed = yield new web3.eth.Contract(params.abi, params.address, {
                from: params.from || account,
                gas: opts && opts.gas || constants_1.GAS,
                gasPrice: opts && opts.gasPrice || constants_1.GAS_PRICE
            });
            return !!this.deployed;
        });
    }
    deployContract(web3, params, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts);
            this.deployed = yield new web3.eth.Contract(params.abi, undefined, { gas: opts && opts.gas || constants_1.GAS, gasPrice: opts && opts.gasPrice || constants_1.GAS_PRICE })
                .deploy({ data: params.bytecode, arguments: params.args || [] })
                .send({ from: account });
            return this.deployed.options.address;
        });
    }
    getAddress() {
        const deployed = this.requireDeployed();
        return deployed.options.address;
    }
    getDeployed() { return this.deployed; }
    getEventEmitter(name, opts) {
        const emitter = this.requireEmitter(name, opts);
        return emitter;
    }
    getPastEvents(name, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.getPastEvents(name, opts);
        });
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
    setProvider(provider) {
        const deployed = this.requireDeployed();
        deployed.setProvider(provider);
    }
}
exports.default = default_1;
