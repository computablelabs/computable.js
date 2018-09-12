import { Nos } from '../types';
export interface RegistryDeployParams {
    tokenAddress: string;
    votingAddress: string;
    parameterizerAddress: string;
    name: string;
}
export interface RegistryListing {
    applicationExpiry: Nos;
    whitelisted: boolean;
    owner: string;
    unstakedDeposit: Nos;
    challenge?: Nos;
}
export interface RewardsClaimed {
    [key: string]: boolean;
}
export interface Challenge {
    rewardPool: Nos;
    challenger: string;
    resolved: boolean;
    stake: Nos;
    totalTokens: Nos;
    rewardsClaimed?: RewardsClaimed;
}
