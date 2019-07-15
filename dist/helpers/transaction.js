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
const constants_1 = require("../constants");
function call(args) {
    return args[0].call(args[1]);
}
exports.call = call;
function transact(args) {
    return args[0].send(args[1]);
}
exports.transact = transact;
function buildTransaction(w3, args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!args[1].from)
            throw constants_1.Errors.NO_ACCOUNT_AVAILABLE;
        const encoded = args[0].encodeABI();
        const count = yield w3.eth.getTransactionCount(args[1].from);
        const built = Object.assign(args[1], {
            nonce: w3.utils.toHex(count),
            data: encoded,
        });
        return built;
    });
}
exports.buildTransaction = buildTransaction;
function signTransaction(w3, privateKey, tx) {
    return __awaiter(this, void 0, void 0, function* () {
        return w3.eth.accounts.signTransaction(tx, privateKey);
    });
}
exports.signTransaction = signTransaction;
function sendRawTransaction(w3, tx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tx.rawTransaction)
            throw constants_1.Errors.NO_RAW_TRANSACTION;
        return w3.eth.sendSignedTransaction(tx.rawTransaction);
    });
}
exports.sendRawTransaction = sendRawTransaction;
function send(w3, privateKey, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const built = yield buildTransaction(w3, args);
        const signed = yield signTransaction(w3, privateKey, built);
        return sendRawTransaction(w3, signed);
    });
}
exports.send = send;
