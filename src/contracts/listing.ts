import Web3 from 'web3'
import Deployed from '../abstracts/deployed'
import { Nos } from '../@types'
import { LISTING_ABI } from '../constants'
import {
  TransactOpts,
  Listing,
} from '../interfaces'

export default class extends Deployed {
  /**
   * Set our deployed refernce from an already deployed listng contract
   * @see abstracts/deployable#at
   */
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, LISTING_ABI, opts)
  }
}
