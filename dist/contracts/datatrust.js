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
        return super.at(w3, address, constants_1.DATATRUST_ABI, opts);
    }
    setPrivileged(listing, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('setPrivileged') }, opts);
            return [yield deployed.methods.setPrivileged(listing), assigned];
        });
    }
    getPrivileged(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getPrivileged') }, opts);
            return [yield deployed.methods.getPrivileged(), assigned];
        });
    }
    getHash(url, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getHash') }, opts);
            return [yield deployed.methods.getHash(url), assigned];
        });
    }
    getBackendAddress(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getBackendAddress') }, opts);
            return [yield deployed.methods.getBackendAddress(), assigned];
        });
    }
    getBackendUrl(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getBackendUrl') }, opts);
            return [yield deployed.methods.getBackendUrl(), assigned];
        });
    }
    setBackendUrl(url, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('setBackendUrl') }, opts);
            return [yield deployed.methods.setBackendUrl(url), assigned];
        });
    }
    setDataHash(listing, data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('setDataHash') }, opts);
            return [yield deployed.methods.setDataHash(listing, data), assigned];
        });
    }
    register(url, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('register') }, opts);
            return [yield deployed.methods.register(url), assigned];
        });
    }
    resolveRegistration(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('resolveRegistration') }, opts);
            return [yield deployed.methods.resolveRegistration(hash), assigned];
        });
    }
    requestDelivery(hash, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('requestDelivery') }, opts);
            return [yield deployed.methods.requestDelivery(hash, amount), assigned];
        });
    }
    getBytesPurchased(addr, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getBytesPurchased') }, opts);
            return [yield deployed.methods.getBytesPurchased(addr), assigned];
        });
    }
    getDelivery(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getDelivery') }, opts);
            return [yield deployed.methods.getDelivery(hash), assigned];
        });
    }
    listingAccessed(listing, delivery, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('listingAccessed') }, opts);
            return [yield deployed.methods.listingAccessed(listing, delivery, amount), assigned];
        });
    }
    getBytesAccessed(hash, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('getBytesAccessed') }, opts);
            return [yield deployed.methods.getBytesAccessed(hash), assigned];
        });
    }
    delivered(delivery, url, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('delivered') }, opts);
            return [yield deployed.methods.delivered(delivery, url), assigned];
        });
    }
}
exports.default = default_1;
