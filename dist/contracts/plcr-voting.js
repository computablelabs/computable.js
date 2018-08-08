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
const PLCRVoting_json_1 = __importDefault(require("../../computable/build/contracts/PLCRVoting.json"));
const helpers_1 = require("../helpers");
class default_1 extends deployable_1.default {
    at(web3, params, opts) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const ap = {
                address: params.address,
                abi: PLCRVoting_json_1.default.abi,
                from: params.from,
            };
            return _super("at").call(this, web3, ap, opts);
        });
    }
    commitVote(web3, pollID, voter, vote, tokens, salt, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts), deployed = this.requireDeployed(), hash = this.getVoteSaltHash(web3, vote, salt);
            let tx1, prevPollID;
            tx1 = yield this.requestVotingRights(tokens, { from: voter });
            prevPollID = yield this.getInsertPointForNumTokens(voter, tokens, pollID);
            return yield deployed.methods.commitVote(pollID, hash, tokens, prevPollID).send({ from: voter });
        });
    }
    deploy(web3, params, opts) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let bytecode = helpers_1.updateBytecode(PLCRVoting_json_1.default.bytecode, 'DLL', params.dllAddress.slice(2));
            bytecode = helpers_1.updateBytecode(bytecode, 'AttributeStore', params.attributeStoreAddress.slice(2));
            const dp = {
                abi: PLCRVoting_json_1.default.abi,
                bytecode: bytecode,
                args: [params.tokenAddress]
            };
            return _super("deployContract").call(this, web3, dp, opts);
        });
    }
    getInsertPointForNumTokens(voter, tokens, pollID) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.getInsertPointForNumTokens(voter, tokens, pollID).call();
        });
    }
    getVoteSaltHash(web3, vote, salt) {
        return web3.utils.soliditySha3({ t: 'uint', v: vote }, { t: 'uint', v: salt });
    }
    requestVotingRights(tokens, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return deployed.methods.requestVotingRights(tokens).send({ from: account });
        });
    }
    withdrawVotingRights(tokens, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return deployed.methods.withdrawVotingRights(tokens).send({ from: account });
        });
    }
    revealVote(pollID, vote, salt, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.revealVote(pollID, vote, salt).send({ from: account });
        });
    }
    commitPeriodActive(pollID) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.commitPeriodActive(pollID).call();
        });
    }
    revealPeriodActive(pollID) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.revealPeriodActive(pollID).call();
        });
    }
}
exports.default = default_1;
