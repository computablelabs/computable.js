/**
 * Methods allowing the developer to more easily work with the TransactionReceipt
 * objects that are returned from any-and-all contract class transactions
 */

import { TransactionReceipt } from 'web3/types'

/**
 * Access the data held in receipt.events.name.returnValues.
 */
export function eventsReturnValues(name:string, tx:TransactionReceipt, refinement?:string): any {
  const ret = tx.events && tx.events[name] && tx.events[name].returnValues
  if (!ret) return

  return refinement ? ret[refinement] : ret
}
