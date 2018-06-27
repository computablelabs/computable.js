import { Nos } from '../types'

export interface Token {
  address:string;
  supply:Nos;
}

export interface TokenHolder {
  address:string;
  amount:Nos;
}

/**
 * Note that the 3 "Vanity" properties are not mandatory, and me be unused by some implementations
 */
export interface Erc20DeployParams {
  address?:string; // Owner of the initial supply, defaults to default acct
  supply?:Nos; // Initial token amount
}
