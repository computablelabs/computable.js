"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function eventsReturnValues(name, tx, refinement) {
    const ret = tx.events && tx.events[name] && tx.events[name].returnValues;
    if (!ret)
        return;
    return refinement ? ret[refinement] : ret;
}
exports.eventsReturnValues = eventsReturnValues;
