"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function maybeParseInt(arg, radix = 10) {
    return typeof arg === 'string' ? parseInt(arg, radix) : arg;
}
exports.maybeParseInt = maybeParseInt;
// NOTE the web3 typed IProvider is incomplete (no sendAsync etc...) TODO flush it out
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
