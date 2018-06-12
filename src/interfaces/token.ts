import { Nos } from '../types'

export interface Token {
  address:string;
  name:string;
  symbol:string;
  supply:Nos;
  decimals:Nos;
}

export interface TokenHolder {
  address:string;
  amount:Nos;
}

/**
 * Note that the 3 "Vanity" properties are not mandatory, and me be unused by some implementations
 */
export interface Eip20DeployParams {
  supply?:Nos; // Initial token amount
  name?:string; // Vanity name of this token
  decimals?:Nos; // Vanity number of decimal places to show
  symbol?:Nos; // Vanity shorthand for this token
}
