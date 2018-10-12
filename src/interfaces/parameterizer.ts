/**
 * Define and export interfaces which are integral to the parameterizer contract
 */

import { Nos } from '../@types'

/**
 * Shape of the parameter object that should be passed to the p11r class during a deploy.
 * Token and Voting addresses are required, the rest will default if falsy.
 */
export interface ParameterizerDeployParams {
  tokenAddress: string; // Address of the token which parameterizes this system
  votingAddress: string; // Address of the PLCR voting contract for the provided token
  minDeposit?:Nos; // Min deposit required for a listing to be included (whitelisted)
  pMinDeposit?:Nos; // Min deposit required to propose changes to the system (reparameterization etc...)
  applyStageLen?:Nos; // The length of time applicants must wait to be whitelisted
  pApplyStageLen?:Nos; // Length of time it will take reparameterization proposals to process
  dispensationPct?:Nos; // Percentage of a losing party's deposit paid to a winning party
  pDispensationPct?:Nos; // Percentage paid to the parameterizer from a losing party
  commitStageLen?:Nos; // Length of time for commit period in voting
  pCommitStageLen?:Nos; // Length of time for commit period in parameterizer
  revealStageLen?:Nos; // Length of time for reveal period in voting
  pRevealStageLen?:Nos; // Length of time for voting reveal period in parameterizer
  voteQuorum?:Nos; // "XX out of 100" type of majority required for vote success
  pVoteQuorum?:Nos; // "XX out of 100" type of majority required, in parameterizer, for vote success
}

export interface ParameterizerProposal {
  appExpiry:Nos;
  challenge:Nos;
  deposit:Nos;
  name:string;
  owner:string;
  processBy:Nos;
  value:Nos;
}
