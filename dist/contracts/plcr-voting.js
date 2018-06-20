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
const helpers_1 = require("../../src/helpers");
/**
 * PLCR Voting
 */
class default_1 extends deployable_1.default {
    /**
     * Commits vote using a created hash with secret salt to conceal vote until reveal
     */
    commitVote(web3, pollID, voter, vote, tokens, salt, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts), deployed = this.requireDeployed(), hash = this.getVoteSaltHash(web3, vote, salt);
            let tx1, prevPollID; // TODO use these to verify intermediate steps or catch errors?
            tx1 = yield this.requestVotingRights(tokens, { from: voter });
            prevPollID = yield this.getInsertPointForNumTokens(voter, tokens, pollID);
            return yield deployed.methods.commitVote(pollID, hash, tokens, prevPollID).send({ from: voter });
        });
    }
    /**
     * Pepare the deploy options, passing them along with the instantiated web3 and optional
     * contract options to the super class' _deploy method.
     * @see abstracts/deployable#_deploy
     */
    deploy(web3, params, opts) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            // voting bytecode must be updated for both library dependencies
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
    /**
     * Takes the last node in the user's DLL and iterates backwards through the list searching
     * for a node with a value less than or equal to the provided tokens value. When such a node
     * is found, if the provided pollID matches the found nodeID, this operation is an in-place
     * update. In that case, return the previous node of the node being updated. Otherwise return the
     * first node that was found with a value less than or equal to the provided tokens.
     */
    getInsertPointForNumTokens(voter, tokens, pollID) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.getInsertPointForNumTokens(voter, tokens, pollID).call();
        });
    }
    /**
     * return a sha3 hash of the vote and salt values
     */
    getVoteSaltHash(web3, vote, salt) {
        // TODO remove this when our Web3 PR is merged
        // @ts-ignore:2554
        return web3.utils.soliditySha3({ t: 'uint', v: vote }, { t: 'uint', v: salt });
    }
    /**
     * Loads a number of ERC20 tokens into the voting contract for one-to-one voting rights.
     * Assumes that `account` has approved the voting contract to spend on their behalf.
     */
    requestVotingRights(tokens, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return deployed.methods.requestVotingRights(tokens).send({ from: account });
        });
    }
    /**
     * Reveals vote cast and secret salt used in generating commitHash to attribute committed tokens
     */
    revealVote(pollID, vote, salt, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.revealVote(pollID, vote, salt).send({ from: account });
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=plcr-voting.js.map