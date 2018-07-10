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
const Registry_json_1 = __importDefault(require("../../computable/build/contracts/Registry.json"));
/**
 * Registry
 *
 * Publisher Interface:
 * -------------------
 * apply
 * withdraw
 * exit
 *
 * Token Holder Interface:
 * ----------------------
 * challenge
 * updateStatus
 *
 * Token Functions:
 * ----------------
 * claimReward
 *
 * Getters:
 * -------
 * appWasMade
 * isWhitelisted
 * listings
 * challenges
 * name
 * parameterizer
 * token
 * voting
 * voterReward
 */
class default_1 extends deployable_1.default {
    /**
     * Allows a user to start an application. Takes tokens from user and sets apply stage end time.
     * @param listing The hash of a potential listing a user is applying to add to the registry
     * @param tokens The number of ERC20 tokens a user is willing to potentially stake
     * @param data Extra data relevant to the application. Think IPFS hashes.
     */
    apply(listing, tokens, data = '', opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.apply(listing, tokens, data).send({ from: account });
        });
    }
    /**
     * Returns a bool that indicates if `apply` was called for a given listing hash
     */
    appWasMade(listing) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return deployed.methods.appWasMade(listing).call();
        });
    }
    /**
     * Set our deployed refernce from an already deployed contract
     * @see abstracts/deployable#at
     */
    at(web3, params, opts) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const ap = {
                address: params.address,
                abi: Registry_json_1.default.abi,
                from: params.from,
            };
            return _super("at").call(this, web3, ap, opts);
        });
    }
    /**
     * Starts a poll for a listingHash which is either in the apply stage or already in the whitelist.
     * Tokens are taken from the challenger and the applicant's deposits are locked.
     * @param listing The hash being challenged, whether listed or in application
     * @param data Extra data relevant to the challenge. Think IPFS hashes.
     */
    challenge(listing, data = '', opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.challenge(listing, data).send({ from: account });
        });
    }
    /**
     * Return a challenge corresponding to the given challegeID.
     */
    challenges(challengeID) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.challenges(challengeID).call();
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
                abi: Registry_json_1.default.abi,
                bytecode: Registry_json_1.default.bytecode,
                args: [
                    params.tokenAddress,
                    params.votingAddress,
                    params.parameterizerAddress,
                    params.name
                ]
            };
            return _super("deployContract").call(this, web3, dp, opts);
        });
    }
    /**
     * Allows the owner of a listingHash to decrease their unstaked deposit.
     *
     * @param listing listing that msg.sender is the owner of
     * @param tokens The number of ERC20 tokens to withdraw from unstaked deposity
     */
    withdraw(listing, tokens, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.withdraw(listing, tokens).send({ from: account });
        });
    }
    /**
     * Allows the owner of a listingHash to remove the listingHash from the whitelist
     * Returns all tokens to the owner of the listingHash
     * @param listing listing that msg.sender is the owner of
     */
    exit(listing, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.exit(listing).send({ from: account });
        });
    }
    /**
     * Return a bool indicating if this listing has been whitelisted
     */
    isWhitelisted(listing) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.isWhitelisted(listing).call();
        });
    }
    /**
     * Return a listing corresponding to the given listing hash.
     */
    listings(listing) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.listings(listing).call();
        });
    }
    /**
     * Return the name passed to this contract instance at deploy time
     */
    name() {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.name().call();
        });
    }
    /**
     * Return the address of the parameterizer referenced by this contract instance
     */
    parameterizer() {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.parameterizer().call();
        });
    }
    /**
     * Return the address of the token referenced by this contract instance
     */
    token() {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.token().call();
        });
    }
    /**
     * Updates a listingHash's status from 'application' to 'listing' or resolves a challenge if one exists.
     * Delegates to `whitelistApplication` or `resolveChallenge`
     */
    updateStatus(listing, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts), deployed = this.requireDeployed();
            return yield deployed.methods.updateStatus(listing).send({ from: account });
        });
    }
    /**
     * Called by voter to claim their reward for each completed vote. Must be preceded by call to updateStatus
     */
    claimReward(challengeId, salt, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts), deployed = this.requireDeployed();
            return yield deployed.methods.claimReward(challengeId, salt).send({ from: account });
        });
    }
    /**
     * Return the address of the plcr-voting referenced by this contract instance
     */
    voting() {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.voting().call();
        });
    }
    /**
     * Return the voter's token reward for the given poll.
     */
    voterReward(voter, challengeId, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.voterReward(voter, challengeId, salt).call();
        });
    }
}
exports.default = default_1;
