import Web3 from 'web3'
import { VOTING_ABI } from '../constants'
import Deployed from '../abstracts/deployed'
import { Nos } from '../@types'
import { TransactOpts } from '../interfaces'

export default class extends Deployed {
  /**
   * Set our deployed refernce from an already deployed contract
   * @see abstracts/deployable#at
   */
  at(w3:Web3, address:string, opts?:TransactOpts): Promise<boolean> {
    return super.at(w3, address, VOTING_ABI, opts)
  }
}
