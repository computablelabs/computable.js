/**
 * Methods allowing the developer to more easily work with the TransactionReceipt
 * objects that are returned from any-and-all contract class transactions
 */
import { TransactionReceipt } from 'web3/types.d';
/**
 * Access the data held in receipt.events.name.returnValues.
 */
export declare function eventReturnValues(name: string, tx: TransactionReceipt, refinement?: string): any;
