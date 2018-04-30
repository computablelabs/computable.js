import { Token as AToken, TokenHolder } from '../interfaces/token'
import { Addresses } from './addresses'
import { ONE_THOUSAND } from './general'

export const Token:AToken =  {
  address: '0x337cDDa6D41A327c5ad456166CCB781a9722AFf9',
  decimals: 2,
  name: 'ComputableCoin',
  symbol: 'CC',
  supply: 5000000,
}

const holderOne:TokenHolder = {
  address: Addresses.ONE,
  amount: ONE_THOUSAND,
}
const holderTwo:TokenHolder = {
  address: Addresses.TWO,
  amount: ONE_THOUSAND,
}
const holderThree:TokenHolder = {
  address: Addresses.THREE,
  amount: ONE_THOUSAND,
}
const holderFour:TokenHolder = {
  address: Addresses.FOUR,
  amount: ONE_THOUSAND,
}
export const TokenHolders:TokenHolder[] = [holderOne, holderTwo, holderThree, holderFour]
