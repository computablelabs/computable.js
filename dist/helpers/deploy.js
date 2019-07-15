"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const constants_1 = require("../constants");
function deploy(w3, account, abi, bytecode, args = []) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new w3.eth.Contract(abi)
            .deploy({ data: bytecode, arguments: args })
            .send({ from: account, gas: constants_1.DEPLOY_GAS, gasPrice: String(constants_1.GAS_PRICE) });
    });
}
exports.deploy = deploy;
function readBytecode(name) {
    const path = path_1.join(__dirname, `../contracts/${name}/${name}.bin`);
    return fs_1.readFileSync(path).toString().trim();
}
exports.readBytecode = readBytecode;
