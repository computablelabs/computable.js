"use strict";
/**
 * Methods allowing the developer to more easily work with the TransactionReceipt
 * objects that are returned from any-and-all contract class transactions
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Access the data held in receipt.events.name.returnValues.
 */
function eventsReturnValues(name, tx, refinement) {
    const ret = tx.events && tx.events[name] && tx.events[name].returnValues;
    if (!ret)
        return;
    return refinement ? ret[refinement] : ret;
}
exports.eventsReturnValues = eventsReturnValues;
