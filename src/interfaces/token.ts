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
