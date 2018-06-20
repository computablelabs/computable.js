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
const deployable_1 = __importDefault(require("../abstracts/deployable"));
const Parameterizer_json_1 = __importDefault(require("../../computable/build/contracts/Parameterizer.json"));
/**
 * Parameterizer
 *
 * Token Holder Interface:
 * ----------------------
 * challengeReparameterization
 * claimReward
 * processProposal
 * proposeReparameterization
 *
 * Getters:
 * -------
 * canBeSet
 * challengeCanBeResolved
 * challengeWinnerReward
 * get
 * propExists
 * tokenClaims
 * voterReward
 *
 * Private:
 * -------
 * resolveChallenge
 * set
 */
class default_1 extends deployable_1.default {
    /**
     * Determines if a proposal passed its application stage without a challenge
     */
    canBeSet(propID) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.canBeSet(propID).call();
        });
    }
    /**
     * Determines whether the provided proposal ID has a challenge which can be resolved
     */
    challengeCanBeResolved(propID) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.challengeCanBeResolved(propID).call();
        });
    }
    /**
     * Challenge a given proposal ID, and stake tokens to do so
     */
    challengeReparameterization(propID, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.challengeReparameterization(propID).send({ from: account });
        });
    }
    /**
     * Pepare the deploy options, passing them along with the instantiated web3 and optional
     * contract options to the super class' _deploy method.
     * @see abstracts/deployable#deployContract
     */
    deploy(web3, params, opts) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const dp = {
                abi: Parameterizer_json_1.default.abi,
                bytecode: Parameterizer_json_1.default.bytecode,
                args: [
                    params.tokenAddress,
                    params.votingAddress,
                    params.minDeposit || constants_1.ParameterDefaults.MIN_DEPOSIT,
                    params.pMinDeposit || constants_1.ParameterDefaults.P_MIN_DEPOSIT,
                    params.applyStageLen || constants_1.ParameterDefaults.APPLY_STAGE_LENGTH,
                    params.pApplyStageLen || constants_1.ParameterDefaults.P_APPLY_STAGE_LENGTH,
                    params.commitStageLen || constants_1.ParameterDefaults.COMMIT_STAGE_LENGTH,
                    params.pCommitStageLen || constants_1.ParameterDefaults.P_COMMIT_STAGE_LENGTH,
                    params.revealStageLen || constants_1.ParameterDefaults.REVEAL_STAGE_LENGTH,
                    params.pRevealStageLen || constants_1.ParameterDefaults.P_REVEAL_STAGE_LENGTH,
                    params.dispensationPct || constants_1.ParameterDefaults.DISPENSATION_PCT,
                    params.pDispensationPct || constants_1.ParameterDefaults.P_DISPENSATION_PCT,
                    params.voteQuorum || constants_1.ParameterDefaults.VOTE_QUORUM,
                    params.pVoteQuorum || constants_1.ParameterDefaults.P_VOTE_QUORUM
                ]
            };
            return _super("deployContract").call(this, web3, dp, opts);
        });
    }
    /**
     * Fetch a given attribute as it is set on the deployed contract
     */
    get(attribute) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.get(attribute).call();
        });
    }
    /**
     * For the given proposal ID, set it, resolve its challenge, or delete it depending on whether it can be set,
     * has a challenge which can be resolved, or if its "process by" date has passed
     */
    processProposal(propID, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.processProposal(propID).send({ from: account });
        });
    }
    /**
     * Determines whether a proposal exists for the provided proposal ID
     */
    propExists(propID) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.propExists(propID).call();
        });
    }
    /**
     * Proposals map pollIDs to intended data change if poll passes
     */
    proposals(propID) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.proposals(propID).call();
        });
    }
    /**
     * Propose a change of the given attribute to the given value
     */
    proposeReparameterization(attribute, val, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.proposeReparameterization(attribute, val).send({ from: account });
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=parameterizer.js.map