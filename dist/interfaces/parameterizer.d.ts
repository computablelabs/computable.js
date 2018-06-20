/**
 * Define and export interfaces which are integral to the parameterizer contract
 */
import { Nos } from '../types';
/**
 * Shape of the parameter object that should be passed to the p11r class during a deploy.
 * Token and Voting addresses are required, the rest will default if falsy.
 */
export interface ParameterizerDeployParams {
    tokenAddress: string;
    votingAddress: string;
    minDeposit?: Nos;
    pMinDeposit?: Nos;
    applyStageLen?: Nos;
    pApplyStageLen?: Nos;
    dispensationPct?: Nos;
    pDispensationPct?: Nos;
    commitStageLen?: Nos;
    pCommitStageLen?: Nos;
    revealStageLen?: Nos;
    pRevealStageLen?: Nos;
    voteQuorum?: Nos;
    pVoteQuorum?: Nos;
}
export interface ParameterizerProposal {
    appExpiry: Nos;
    challengeID: Nos;
    deposit: Nos;
    name: string;
    owner: string;
    processBy: Nos;
    value: Nos;
}
