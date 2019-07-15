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
const constants_1 = require("../constants");
const deployed_1 = __importDefault(require("../abstracts/deployed"));
class default_1 extends deployed_1.default {
    at(w3, address, opts) {
        return super.at(w3, address, constants_1.RESERVE_ABI, opts);
    }
    getSupportPrice(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getSupportPrice') }, opts);
            return [yield deployed.methods.getSupportPrice(), assigned];
        });
    }
    support(offer, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('support') }, opts);
            return [yield deployed.methods.support(offer), assigned];
        });
    }
    getWithdrawalProceeds(address, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getWithdrawalProceeds') }, opts);
            return [yield deployed.methods.getWithdrawalProceeds(address), assigned];
        });
    }
    withdraw(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('withdraw') }, opts);
            return [yield deployed.methods.withdraw(), assigned];
        });
    }
}
exports.default = default_1;
