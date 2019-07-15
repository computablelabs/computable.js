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
    constructor(account) {
        if (account)
            this.account = account;
    }
    at(w3, address, abi, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts);
            this.address = address;
            this.abi = abi;
            this.deployed = yield new w3.eth.Contract(abi, address);
            return !!this.deployed;
        });
    }
    assignTransactOpts(src, opts) {
        const account = this.requireAccount(opts);
        if (opts) {
            src = Object.assign(src, opts);
        }
        if (!('from' in src))
            src.from = account;
        if (!('gasPrice' in src))
            src.gasPrice = constants_1.GAS_PRICE;
        return src;
    }
    getGas(method) {
        if (!this.abi)
            throw constants_1.Errors.NO_ABI_SET;
        let gas = constants_1.MIN_GAS;
        for (let obj of this.abi) {
            if ('name' in obj && obj['name'] === method) {
                gas = obj['gas'];
                break;
            }
        }
        return gas + constants_1.GAS_BUFFER;
    }
    requireAccount(opts) {
        const account = opts && opts.from || this.account;
        if (!account)
            throw constants_1.Errors.NO_ACCOUNT_AVAILABLE;
        return account;
    }
    requireDeployed() {
        if (!this.deployed)
            throw constants_1.Errors.CONTRACT_NOT_DEPLOYED;
        return this.deployed;
    }
}
exports.default = default_1;
