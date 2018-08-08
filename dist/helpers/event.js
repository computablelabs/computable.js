"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function onError(emitter) {
    return new Promise(resolve => {
        emitter.on('error', (e) => resolve(e));
    });
}
exports.onError = onError;
function eventReturnValues(name, log) {
    return log.returnValues[name];
}
exports.eventReturnValues = eventReturnValues;
