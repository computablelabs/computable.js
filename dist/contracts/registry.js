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
                return yield deployed.methods.apply(listing, tokens, data).send(this.assignContractOptions({ from: account }, opts));
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
    challenge(web3, listing, data = '', opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            if (opts && opts.sign) {
                const encoded = deployed.methods.challenge(listing, data).encodeABI();
                return yield helpers_1.sendSignedTransaction(web3, deployed.options.address, account, encoded, opts);
            }
            else
                return yield deployed.methods.challenge(listing, data).send(this.assignContractOptions({ from: account }, opts));
        });
    }
    challenges(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed();
            return yield deployed.methods.challenges(id).call();
        });
    }
    claimReward(web3, id, salt, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts), deployed = this.requireDeployed();
            if (opts && opts.sign) {
                const encoded = deployed.methods.claimReward(id, salt).encodeABI();
                return yield helpers_1.sendSignedTransaction(web3, deployed.options.address, account, encoded, opts);
            }
            else
                return yield deployed.methods.claimReward(id, salt).send(this.assignContractOptions({ from: account }, opts));
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
    deposit(web3, listing, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts), deployed = this.requireDeployed();
            if (opts && opts.sign) {
                const encoded = deployed.methods.deposit(listing, amount).encodeABI();
                return yield helpers_1.sendSignedTransaction(web3, deployed.options.address, account, encoded, opts);
            }
            else
                return yield deployed.methods.deposit(listing, amount).send(this.assignContractOptions({ from: account }, opts));
        });
    }
    exit(web3, listing, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            if (opts && opts.sign) {
                const encoded = deployed.methods.exit(listing).encodeABI();
                return yield helpers_1.sendSignedTransaction(web3, deployed.options.address, account, encoded, opts);
            }
            else
                return yield deployed.methods.exit(listing).send(this.assignContractOptions({ from: account }, opts));
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
    updateStatus(web3, listing, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.requireAccount(opts), deployed = this.requireDeployed();
            if (opts && opts.sign) {
                const encoded = deployed.methods.updateStatus(listing).encodeABI();
                return yield helpers_1.sendSignedTransaction(web3, deployed.options.address, account, encoded, opts);
            }
            else
                return yield deployed.methods.updateStatus(listing).send(this.assignContractOptions({ from: account }, opts));
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
    withdraw(web3, listing, tokens, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployed = this.requireDeployed(), account = this.requireAccount(opts);
            if (opts && opts.sign) {
                const encoded = deployed.methods.withdraw(listing, tokens).encodeABI();
                return yield helpers_1.sendSignedTransaction(web3, deployed.options.address, account, encoded, opts);
            }
            else
                return yield deployed.methods.withdraw(listing, tokens).send(this.assignContractOptions({ from: account }, opts));
        });
    }
}
exports.default = default_1;
