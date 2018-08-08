"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deployable_1 = __importDefault(require("../abstracts/deployable"));
const ConstructableToken_json_1 = __importDefault(require("../../computable/build/contracts/ConstructableToken.json"));
const constants_1 = require("../constants");
class default_1 extends deployable_1.default {
    allowance(owner, spender) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return deployed.methods.allowance(owner, spender).call();
        });
    }
    approve(address, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.approve(address, amount).send({ from: account });
        });
    }
    at(web3, params, opts) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const ap = {
                address: params.address,
                abi: ConstructableToken_json_1.default.abi,
                from: params.from,
            };
            return _super("at").call(this, web3, ap, opts);
        });
    }
    balanceOf(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.balanceOf(address).call();
        });
    }
    deploy(web3, params = {}, opts) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const dp = {
                abi: ConstructableToken_json_1.default.abi,
                bytecode: ConstructableToken_json_1.default.bytecode,
                args: [
                    params.address || this.defaultAccount,
                    params.supply || constants_1.Token.supply
                ]
            };
            return _super("deployContract").call(this, web3, dp, opts);
        });
    }
    transfer(address, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.transfer(address, amount).send({ from: account });
        });
    }
    transferFrom(from, to, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.transferFrom(from, to, amount).send({ from: account });
        });
    }
}
exports.default = default_1;
