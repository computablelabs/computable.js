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
    challengeID?: Nos;
}
export interface TokenClaims {
    [key: string]: boolean;
}
export interface Challenge {
    rewardPool: Nos;
    address: string;
    resolved: boolean;
    stake: Nos;
    totalTokens: Nos;
    tokenClaims?: TokenClaims;
}
