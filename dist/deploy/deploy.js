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
const fs_1 = __importDefault(require("fs"));
const web3_1 = __importDefault(require("web3"));
const truffle_hdwallet_provider_1 = __importDefault(require("truffle-hdwallet-provider"));
const constants_1 = require("../constants");
const erc_20_1 = __importDefault(require("../contracts/erc-20"));
const plcr_voting_1 = __importDefault(require("../contracts/plcr-voting"));
const parameterizer_1 = __importDefault(require("../contracts/parameterizer"));
const registry_1 = __importDefault(require("../contracts/registry"));
const helpers_1 = require("../helpers");
let mnemonic = '', account = '', infuraToken = '';
if (fs_1.default.existsSync('secrets.json')) {
    const secrets = JSON.parse(fs_1.default.readFileSync('secrets.json', 'utf8'));
    mnemonic = secrets.mnemonic;
    account = secrets.account;
    infuraToken = secrets.infuraAccessToken;
}
else {
    console.log('No secrets.json file found in your project');
}
let web3, provider, token, tokenAddress, dll, dllAddress, store, attributeStoreAddress, voting, votingAddress, parameterizer, parameterizerAddress, registry, registryAddress;
provider = new truffle_hdwallet_provider_1.default(mnemonic, `https://ropsten.infura.io/${infuraToken}`);
web3 = new web3_1.default(provider);
const deploy = () => __awaiter(this, void 0, void 0, function* () {
    token = new erc_20_1.default(account);
    tokenAddress = yield token.deploy(web3, { address: account, supply: 2000000000000000000 }, { gas: constants_1.TEST_NET_GAS, gasPrice: constants_1.TEST_NET_GAS_PRICE });
    console.log(`TOKEN ADDRESS: ${tokenAddress}`);
    dll = yield helpers_1.deployDll(web3, account);
    dllAddress = dll.options.address;
    store = yield helpers_1.deployAttributeStore(web3, account);
    attributeStoreAddress = store.options.address;
    voting = new plcr_voting_1.default(account);
    votingAddress = yield voting.deploy(web3, { tokenAddress, dllAddress, attributeStoreAddress }, { gas: constants_1.TEST_NET_GAS, gasPrice: constants_1.TEST_NET_GAS_PRICE });
    console.log(`VOTING ADDRESS: ${votingAddress}`);
    parameterizer = new parameterizer_1.default(account);
    parameterizerAddress = yield parameterizer.deploy(web3, { tokenAddress, votingAddress }, { gas: constants_1.TEST_NET_GAS, gasPrice: constants_1.TEST_NET_GAS_PRICE });
    console.log(`PARAMETERIZER ADDRESS: ${parameterizerAddress}`);
    registry = new registry_1.default(account);
    registryAddress = yield registry.deploy(web3, { tokenAddress, votingAddress, parameterizerAddress, name: 'Computable TCR v0.1.0' }, { gas: constants_1.TEST_NET_GAS, gasPrice: constants_1.TEST_NET_GAS_PRICE });
    console.log(`REGISTRY ADDRESS: ${registryAddress}`);
});
deploy();
