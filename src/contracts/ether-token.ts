import Web3 from 'web3'
import { TransactOpts } from '../interfaces'
import { ETHER_TOKEN_ABI } from '../constants'
import Erc20 from './erc-20'

export default class extends Erc20 {
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, ETHER_TOKEN_ABI, opts)
  }
}
