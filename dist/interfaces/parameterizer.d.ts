import { Nos } from '../@types';
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
    challenge: Nos;
    deposit: Nos;
    name: string;
    owner: string;
    processBy: Nos;
    value: Nos;
}
