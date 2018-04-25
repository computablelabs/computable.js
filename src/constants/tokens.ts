import { Token as AToken, TokenHolder } from '../interfaces/token'
import { Addresses } from './addresses'
import { amount } from './general'

export const Token:AToken =  {
  address: '0x337cDDa6D41A327c5ad456166CCB781a9722AFf9',
  decimals: 2,
  name: 'ComputableCoin',
  symbol: 'CC',
  supply: 5000000,
  deployToken: true,
}

const holderOne:TokenHolder = {
  address: Addresses.One,
  amount: amount,
}
const holderTwo:TokenHolder = {
  address: Addresses.Two,
  amount: amount,
}
const holderThree:TokenHolder = {
  address: Addresses.Three,
  amount: amount,
}
const holderFour:TokenHolder = {
  address: Addresses.Four,
  amount: amount,
}
export const tokenHolders:TokenHolder[] = [holderOne, holderTwo, holderThree, holderFour]
