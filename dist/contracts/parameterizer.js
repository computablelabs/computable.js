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
        return super.at(w3, address, constants_1.PARAMETERIZER_ABI, opts);
    }
    getBackendPayment(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getBackendPayment') }, opts);
            return [yield deployed.methods.getBackendPayment(), assigned];
        });
    }
    getMakerPayment(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getMakerPayment') }, opts);
            return [yield deployed.methods.getMakerPayment(), assigned];
        });
    }
    getReservePayment(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getReservePayment') }, opts);
            return [yield deployed.methods.getReservePayment(), assigned];
        });
    }
    getCostPerByte(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getCostPerByte') }, opts);
            return [yield deployed.methods.getCostPerByte(), assigned];
        });
    }
    getStake(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getStake') }, opts);
            return [yield deployed.methods.getStake(), assigned];
        });
    }
    getPriceFloor(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getPriceFloor') }, opts);
            return [yield deployed.methods.getPriceFloor(), assigned];
        });
    }
    getHash(param, value, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getHash') }, opts);
            return [yield deployed.methods.getHash(param, value), assigned];
        });
    }
    getSpread(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getSpread') }, opts);
            return [yield deployed.methods.getSpread(), assigned];
        });
    }
    getListReward(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getListReward') }, opts);
            return [yield deployed.methods.getListReward(), assigned];
        });
    }
    getPlurality(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getPlurality') }, opts);
            return [yield deployed.methods.getPlurality(), assigned];
        });
    }
    getReparam(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getReparam') }, opts);
            return [yield deployed.methods.getReparam(hash), assigned];
        });
    }
    getVoteBy(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getVoteBy') }, opts);
            return [yield deployed.methods.getVoteBy(), assigned];
        });
    }
    reparameterize(param, value, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('reparameterize') }, opts);
            return [yield deployed.methods.reparameterize(param, value), assigned];
        });
    }
    resolveReparam(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('resolveReparam') }, opts);
            return [yield deployed.methods.resolveReparam(hash), assigned];
        });
    }
}
exports.default = default_1;
