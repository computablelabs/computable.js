import { Nos } from '../types'

/**
 * Contracts have some repeatedly used options which may, or may not be passed
 * to their methods.
 *
 * TODO <any> for gas types required because of the web3 ts def - correct that and PR
 */
export interface ContractOptions {
  to?:string;
  from?:string;
  gas?:any;
  gasPrice?:any;
}

/**
 * The deploy process is generally the same from contract to contract.
 * All will require ABI, bytecode and and args (or an empty array)
 */
export interface DeployParams {
  abi:any;
  bytecode:string;
  args?:any[];
}
