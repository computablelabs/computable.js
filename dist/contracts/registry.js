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
const helpers_1 = require("../helpers");
class default_1 extends deployable_1.default {
    apply(web3, listing, tokens, data = '', opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            if (opts && opts.sign) {
                const encoded = deployed.methods.apply(listing, tokens, data).encodeABI();
                return yield helpers_1.sendSignedTransaction(web3, deployed.options.address, account, encoded, opts);
            }
            else
                return yield deployed.methods.apply(listing, tokens, data).send(Object.assign({ from: account }, opts || {}));
        });
    }
    appWasMade(listing) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return deployed.methods.appWasMade(listing).call();
        });
    }
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
    challenge(listing, data = '', opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.challenge(listing, data).send({ from: account });
        });
    }
    challenges(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.challenges(id).call();
        });
    }
    claimReward(id, salt, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts), deployed = this.requireDeployed();
            return yield deployed.methods.claimReward(id, salt).send({ from: account });
        });
    }
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
    deposit(listing, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts), deployed = this.requireDeployed();
            return yield deployed.methods.deposit(listing, amount).send({ from: account });
        });
    }
    exit(listing, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.exit(listing).send({ from: account });
        });
    }
    isWhitelisted(listing) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.isWhitelisted(listing).call();
        });
    }
    listings(listing) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.listings(listing).call();
        });
    }
    name() {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.name().call();
        });
    }
    parameterizer() {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.parameterizer().call();
        });
    }
    token() {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.token().call();
        });
    }
    updateStatus(listing, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts), deployed = this.requireDeployed();
            return yield deployed.methods.updateStatus(listing).send({ from: account });
        });
    }
    voting() {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.voting().call();
        });
    }
    voterReward(voter, id, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.voterReward(voter, id, salt).call();
        });
    }
    canBeWhitelisted(listing) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.canBeWhitelisted(listing).call();
        });
    }
    withdraw(listing, tokens, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            return yield deployed.methods.withdraw(listing, tokens).send({ from: account });
        });
    }
}
exports.default = default_1;
