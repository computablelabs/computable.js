import { EventEmitter, EventLog } from 'web3/types'
/**
 * The callback-based Event Emitter system exposed in Web3's `.on` paradigm
 * can be 'promisified' via this helper so that you can use async/await with it.
 * Since we know that there are only 3 variants we will expose methods for each to
 * prevent the need to pass a name.
 *
 * Note the promise is for the full event log in return for `data` && `changed` vs the
 * Error returned for `error`
 */

export function onData(emitter:EventEmitter): Promise<EventLog> {
  return new Promise(resolve => {
    emitter.on('data', (log:EventLog) => resolve(log))
  })
}

export function onChanged(emitter:EventEmitter): Promise<EventLog> {
  return new Promise(resolve => {
    emitter.on('changed', (log:EventLog) => resolve(log))
  })
}

// the error listener does not recieve an Eventlog but, appropriately, an Error
export function onError(emitter:EventEmitter): Promise<Error> {
  return new Promise(resolve => {
    emitter.on('error', (e:Error) => resolve(e))
  })
}

/**
 * The websocket enabled version of this method. Note that, in the `receipt` helper there
 * is a function of a similar name, "eventsReturnValues", however, that method is meant to work with `TransactionReceipt` objects,
 * while this one is for the `EventLog` returned from an `onData` emitter.
 *
 * Generally this is the preferred method, as you should be using websockets.
 */
export function eventReturnValues(name:string, log:EventLog): any {
  return log.returnValues[name]
}
