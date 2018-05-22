/**
 * Define and export interfaces which are needed for the registry contract
 */

import { Nos } from '../types'

export interface RegistryListing {
  applicationExpiry:Nos; // Expiration date of apply stage
  whitelisted:boolean; // Indicates registry status
  owner:string; // Owner of sisting
  unstakedDeposit:Nos; // Number of tokens in the listing not locked in a challenge
  challengeID:Nos; // Corresponds to a pollID in PLCRVoting
}
