export interface Token {
  address: string;
  name: string;
  symbol: string;
  // TODO is this a string, bytes, number ?
  supply: string;
  decimals: string;
  deployToken: boolean;
}

export interface TokenHolder {
  address: string;
  amount: string;
}
