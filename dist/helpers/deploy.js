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
const DLL_json_1 = __importDefault(require("../../computable/build/contracts/DLL.json"));
const AttributeStore_json_1 = __importDefault(require("../../computable/build/contracts/AttributeStore.json"));
const constants_1 = require("../constants");
function deploy(web3, account, abi, bytecode, args = []) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new web3.eth.Contract(abi, undefined, { gasPrice: constants_1.GAS_PRICE, gas: constants_1.GAS })
            .deploy({ data: bytecode, arguments: args })
            .send({ from: account });
    });
}
function deployAttributeStore(web3, account) {
    return __awaiter(this, void 0, void 0, function* () {
        return deploy(web3, account, AttributeStore_json_1.default.abi, AttributeStore_json_1.default.bytecode);
    });
}
exports.deployAttributeStore = deployAttributeStore;
function deployDll(web3, account) {
    return __awaiter(this, void 0, void 0, function* () {
        return deploy(web3, account, DLL_json_1.default.abi, DLL_json_1.default.bytecode);
    });
}
exports.deployDll = deployDll;
function updateBytecode(bytecode, library, address) {
    return bytecode.replace(new RegExp(`__${library}__+`, 'g'), address);
}
exports.updateBytecode = updateBytecode;
