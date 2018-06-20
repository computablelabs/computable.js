import { EventEmitter, EventLog } from 'web3/types.d';
/**
 * The callback-based Event Emitter system exposed in Web3's `.on` paradigm
 * can be 'promisified' via this helper so that you can use async/await with it.
 * Since we know that there are only 3 variants we will expose methods for each to
 * prevent the need to pass a name.
 *
 * Note the promise is for the full event log in return for `data` && `changed` vs the
 * Error returned for `error`
 */
export declare function onData(emitter: EventEmitter): Promise<EventLog>;
export declare function onChanged(emitter: EventEmitter): Promise<EventLog>;
export declare function onError(emitter: EventEmitter): Promise<Error>;
