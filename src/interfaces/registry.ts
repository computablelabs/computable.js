/**
 * Define and export interfaces which are needed for the registry contract
 */

import { Nos } from '../types'

/**
 * Shape of the parameter object that should be passed to the registry class during a deploy.
 */
export interface RegistryDeployParams {
  tokenAddress: string; // deployed address of the token that this contract references
  votingAddress: string; // deployed address of a PLCRVoting contract this contract references
  parameterizerAddress: string; // deployed address of a Parameterizer this contract references
  name: string; // The name of this registry
}

export interface RegistryListing {
  applicationExpiry:Nos; // Expiration date of apply stage
  whitelisted:boolean; // Indicates registry status
  owner:string; // Owner of listing
  unstakedDeposit:Nos; // Number of tokens in the listing not locked in a challenge
  challengeID?:Nos; // Corresponds to a pollID in PLCRVoting
}

interface TokenClaims {
  [key:string]: boolean;
}

export interface Challenge {
  rewardPool:Nos; // (remaining) Pool of tokens to be distributed to winning voters
  address:string; // Owner of the challenge
  resolved:boolean; // Indication of whether the challenge has been resolved
  stake:Nos; // Number of tokens at stake for either party during a challenge
  totalTokens:Nos; // (remaining) Number of tokens used in voting by the winning side
  tokenClaims?:TokenClaims; // Indication of whether a voter has claimed a reward yet
}
