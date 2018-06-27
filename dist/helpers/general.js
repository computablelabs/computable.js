"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function maybeParseInt(arg, radix = 10) {
    return typeof arg === 'string' ? parseInt(arg, radix) : arg;
}
exports.maybeParseInt = maybeParseInt;
