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
const ethereumjs_tx_1 = __importDefault(require("ethereumjs-tx"));
function maybeParseInt(arg, radix = 10) {
    return typeof arg === 'string' ? parseInt(arg, radix) : arg;
}
exports.maybeParseInt = maybeParseInt;
function increaseTime(provider, seconds) {
    return new Promise((resolve, reject) => provider.send({
        id: new Date().getSeconds(),
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [seconds],
    }, (err, data) => {
        if (err)
            reject(err);
        resolve(data);
    })).then((result) => new Promise((resolve, reject) => provider.send({
        id: new Date().getSeconds(),
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
    }, (err, data) => {
        if (err)
            reject(err);
        resolve({ increaseTime: result, mine: data });
    })));
}
exports.increaseTime = increaseTime;
function stringToBytes(web3, str) {
    return web3.utils.toHex(str);
}
exports.stringToBytes = stringToBytes;
function sendSignedTransaction(web3, to, from, encoded, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawTx = {
            to: web3.utils.toHex(to),
            from: web3.utils.toHex(from),
            nonce: yield web3.eth.getTransactionCount(from),
            data: web3.utils.toHex(encoded),
            gasLimit: opts.gas,
            gasPrice: opts.gasPrice,
        };
        let tx = new ethereumjs_tx_1.default(rawTx);
        tx.sign(new Buffer(opts.sign, 'hex'));
        tx = tx.serialize().toString('hex');
        return web3.eth.sendSignedTransaction(`0x${tx}`);
    });
}
exports.sendSignedTransaction = sendSignedTransaction;
