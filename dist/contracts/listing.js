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
        return super.at(w3, address, constants_1.LISTING_ABI, opts);
    }
    isListed(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('isListed') }, opts);
            return [yield deployed.methods.isListed(hash), assigned];
        });
    }
    withdrawFromListing(hash, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('withdrawFromListing') }, opts);
            return [yield deployed.methods.withdrawFromListing(hash, amount), assigned];
        });
    }
    list(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('list') }, opts);
            return [yield deployed.methods.list(hash), assigned];
        });
    }
    getListing(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getListing') }, opts);
            return [yield deployed.methods.getListing(hash), assigned];
        });
    }
    resolveApplication(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('resolveApplication') }, opts);
            return [yield deployed.methods.resolveApplication(hash), assigned];
        });
    }
    claimBytesAccessed(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('claimBytesAccessed') }, opts);
            return [yield deployed.methods.claimBytesAccessed(hash), assigned];
        });
    }
    challenge(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('challenge') }, opts);
            return [yield deployed.methods.challenge(hash), assigned];
        });
    }
    resolveChallenge(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('resolveChallenge') }, opts);
            return [yield deployed.methods.resolveChallenge(hash), assigned];
        });
    }
    exit(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('exit') }, opts);
            return [yield deployed.methods.exit(hash), assigned];
        });
    }
}
exports.default = default_1;
