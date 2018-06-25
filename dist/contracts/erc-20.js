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
    /**
     * An amount of funds an owner has given a spender permission to use
     */
    allowance(owner, spender) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return deployed.methods.allowance(owner, spender).call();
        });
    }
    /**
     * Grant permission to a spender located at the given address to use up to the given amount of funds
     */
    approve(address, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.approve(address, amount).send({ from: account });
        });
    }
    /**
     * Return the current balance of the given address
     */
    balanceOf(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.balanceOf(address).call();
        });
    }
    /**
     * Pepare the deploy options, passing them along with the instantiated web3 and optional
     * contract options to the super class' deployContract method.
     * @see abstracts/deployable#deployContract
     */
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
    /**
     * Move the given number of funds from the msg.sender to a given address
     */
    transfer(address, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.transfer(address, amount).send({ from: account });
        });
    }
    /**
     * Move the given number of funds from one given address to another given address
     */
    transferFrom(from, to, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.transferFrom(from, to, amount).send({ from: account });
        });
    }
}
exports.default = default_1;
