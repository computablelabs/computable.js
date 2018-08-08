import { EventEmitter, EventLog } from 'web3/types.d';
export declare function onData(emitter: EventEmitter): Promise<EventLog>;
export declare function onChanged(emitter: EventEmitter): Promise<EventLog>;
export declare function onError(emitter: EventEmitter): Promise<Error>;
export declare function eventReturnValues(name: string, log: EventLog): any;
