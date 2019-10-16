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
        return super.at(w3, address, constants_1.VOTING_ABI, opts);
    }
    setPrivileged(parameterizer, datatrust, listing, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('setPrivileged') }, opts);
            return [yield deployed.methods.setPrivileged(parameterizer, datatrust, listing), assigned];
        });
    }
    getPrivileged(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getPrivileged') }, opts);
            return [yield deployed.methods.getPrivileged(), assigned];
        });
    }
    hasPrivilege(addr, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('hasPrivilege') }, opts);
            return [yield deployed.methods.hasPrivilege(addr), assigned];
        });
    }
    candidateIs(hash, kind, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('candidateIs') }, opts);
            return [yield deployed.methods.candidateIs(hash, kind), assigned];
        });
    }
    isCandidate(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('isCandidate') }, opts);
            return [yield deployed.methods.isCandidate(hash), assigned];
        });
    }
    getCandidate(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getCandidate') }, opts);
            return [yield deployed.methods.getCandidate(hash), assigned];
        });
    }
    getCandidateOwner(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getCandidateOwner') }, opts);
            return [yield deployed.methods.getCandidateOwner(hash), assigned];
        });
    }
    didPass(hash, plurality, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('didPass') }, opts);
            return [yield deployed.methods.didPass(hash, plurality), assigned];
        });
    }
    vote(hash, option, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('vote') }, opts);
            return [yield deployed.methods.vote(hash, option), assigned];
        });
    }
    getStake(hash, address, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getStake') }, opts);
            return [yield deployed.methods.getStake(hash, address), assigned];
        });
    }
    unstake(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('unstake') }, opts);
            return [yield deployed.methods.unstake(hash), assigned];
        });
    }
}
exports.default = default_1;
