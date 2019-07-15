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
const deployed_1 = __importDefault(require("../abstracts/deployed"));
class default_1 extends deployed_1.default {
    allowance(owner, spender, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('allowance') }, opts);
            return [yield deployed.methods.allowance(owner, spender), assigned];
        });
    }
    approve(spender, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('approve') }, opts);
            return [yield deployed.methods.approve(spender, amount), assigned];
        });
    }
    balanceOf(owner, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('balanceOf') }, opts);
            return [yield deployed.methods.balanceOf(owner), assigned];
        });
    }
    decreaseApproval(spender, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('decreaseApproval') }, opts);
            return [yield deployed.methods.decreaseApproval(spender, amount), assigned];
        });
    }
    getDecimals(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('decimals') }, opts);
            return [yield deployed.methods.decimals(), assigned];
        });
    }
    getSymbol(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('symbol') }, opts);
            return [yield deployed.methods.symbol(), assigned];
        });
    }
    increaseApproval(spender, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('increaseApproval') }, opts);
            return [yield deployed.methods.increaseApproval(spender, amount), assigned];
        });
    }
    totalSupply(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('totalSupply') }, opts);
            return [yield deployed.methods.totalSupply(), assigned];
        });
    }
    transfer(to, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('transfer') }, opts);
            return [yield deployed.methods.transfer(to, amount), assigned];
        });
    }
    transferFrom(source, to, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('transferFrom') }, opts);
            return [yield deployed.methods.transferFrom(source, to, amount), assigned];
        });
    }
}
exports.default = default_1;
