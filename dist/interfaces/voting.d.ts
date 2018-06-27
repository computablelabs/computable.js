/**
 * Shape of the parameter object that should be passed to the voting class on deploy.
 * All three args are mandatory.
 */
export interface VotingDeployParams {
    tokenAddress: string;
    dllAddress: string;
    attributeStoreAddress: string;
}
