/**
 * Define and export interfaces which are integral to the parameterizer contract
 */

import { Nos } from '../types'

export interface ParameterizerProposal {
  appExpiry:Nos;
  challengeID:Nos;
  deposit:Nos;
  name:string;
  owner:string;
  processBy:Nos;
  value:Nos;
}
