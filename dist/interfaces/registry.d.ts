/**
 * Define and export interfaces which are needed for the registry contract
 */
import { Nos } from '../types';
/**
 * Shape of the parameter object that should be passed to the registry class during a deploy.
 */
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
