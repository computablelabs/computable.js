/**
 * Define and export interfaces which are needed for the registry contract
 */

import { Nos } from '../@types'

export interface Listing {
  owner?:string; // Owner of listing
  supply?:Nos; // amount of market token in wei the listing may have
}

// export interface RewardsClaimed {
  // [key:string]: boolean;
// }
