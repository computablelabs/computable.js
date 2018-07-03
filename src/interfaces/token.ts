import { Nos } from '../types'

export interface Token {
  address:string;
  supply:Nos;
}

export interface TokenHolder {
  address:string;
  amount:Nos;
}

export interface Erc20DeployParams {
  address?:string; // Owner of the initial supply, defaults to default acct
  supply?:Nos; // Initial token amount
}
