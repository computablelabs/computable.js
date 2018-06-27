"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The callback-based Event Emitter system exposed in Web3's `.on` paradigm
 * can be 'promisified' via this helper so that you can use async/await with it.
 * Since we know that there are only 3 variants we will expose methods for each to
 * prevent the need to pass a name.
 *
 * Note the promise is for the full event log in return for `data` && `changed` vs the
 * Error returned for `error`
 */
function onData(emitter) {
    return new Promise(resolve => {
        emitter.on('data', (log) => resolve(log));
    });
}
exports.onData = onData;
function onChanged(emitter) {
    return new Promise(resolve => {
        emitter.on('changed', (log) => resolve(log));
    });
}
exports.onChanged = onChanged;
// the error listener does not recieve an Eventlog but, appropriately, an Error
function onError(emitter) {
    return new Promise(resolve => {
        emitter.on('error', (e) => resolve(e));
    });
}
exports.onError = onError;
