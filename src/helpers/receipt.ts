/**
 * Methods allowing the developer to more easily work with the TransactionReceipt
 * objects that are returned from any-and-all contract class transactions
 */

import { TransactionReceipt, EventLog } from 'web3/types'

/**
 * Access the data held in receipt.events.name.returnValues.
 */
export function eventsReturnValues(name:string, tx:TransactionReceipt, refinement?:string): any {
  const ret = tx.events && tx.events[name] && tx.events[name].returnValues
  if (!ret) return

  return refinement ? ret[refinement] : ret
}

/**
 * Slighly different return from `getPastEvents` which will be an Array of EventLogs
 * TODO flush out the any types...
 */
export function pastEventsReturnValues(events:EventLog[], refinement?:string): any[] {
  return events.map(evt => refinement ? evt.returnValues[refinement] : evt.returnValues)
}
