/**
 * TSC throws due to the web3/types we are using not being able to find a
 * declaration for this. NPM installing the web3 @types is not a fix atm.
 * TODO address the web3 types -- perhaps just define our own
 */

declare module 'bn.js' {
  export interface IBigNumber {
    [key: string]: any;
  }

  export interface BigNumber {
    new (...args:any[]): IBigNumber;
  }
}
