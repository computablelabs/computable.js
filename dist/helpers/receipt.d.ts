import { TransactionReceipt, EventLog } from 'web3/types';
export declare function eventsReturnValues(name: string, tx: TransactionReceipt, refinement?: string): any;
export declare function pastEventsReturnValues(events: EventLog[], refinement?: string): any[];
