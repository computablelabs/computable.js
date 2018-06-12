/**
 * Shape of the parameter object that should be passed to the voting class on deploy.
 * All three args are mandatory.
 */
export interface VotingDeployParams {
  tokenAddress: string; // Address of the token refereced by this contract
  dllAddress: string; // Address of the deployed DLL contract this contract is `using`
  attributeStoreAddress: string; // Address of the deployed Attribute Store contract this contract is `using`
}
