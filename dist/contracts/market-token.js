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
const erc_20_1 = __importDefault(require("./erc-20"));
class default_1 extends erc_20_1.default {
    at(w3, address, opts) {
        return super.at(w3, address, constants_1.MARKET_TOKEN_ABI, opts);
    }
    setPrivileged(reserve, listing, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            let assigned = this.assignTransactOpts({ gas: this.getGas('setPrivileged') }, opts);
            return [yield deployed.methods.setPrivileged(reserve, listing), assigned];
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
}
exports.default = default_1;
