import Web3 from 'web3'
import { TransactOpts } from '../interfaces'
import { MARKET_TOKEN_ABI } from '../constants'
import Erc20 from './erc-20'

export default class extends Erc20 {
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, MARKET_TOKEN_ABI, opts)
  }
}
