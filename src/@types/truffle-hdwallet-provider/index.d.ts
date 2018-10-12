/**
 * Typescript module definition for the Truffle HD Wallet
 * TODO fill in the descriptors correctly as most of these are "any-fied" to get our test env working
 * TODO flush out the rest of the wallet's API
 */

declare module 'truffle-hdwallet-provider' {
  export default class HDWalletProvider {
    constructor(mnemonic: string, providerUrl: string, addressIndex?:number, numAddresses?: number);
    responseCallbacks:any;
    notificationCallbacks:any;
    connection: any;
    addDefaultEvents: any;
    on: any;
    removeListener: any;
    removeAllListeners: any;
    reset: any;
    send: any;
  }
}
