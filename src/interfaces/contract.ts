import { BlockType } from 'web3/types.d'
import { Nos } from '../@types'

/**
 * Contracts have some repeatedly used options which may, or may not be passed
 * to their methods.
 *
 * TODO <any> for gas types required because of the web3 ts def - correct that and PR
 */
export interface ContractOptions {
  to?:string;
  from?:string;
  gas?:any; //gasLimit
  gasPrice?:any;
  sign?:string; // value would be a private key
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

/**
 * Fetching an already deployed contract instance requires a different set of params than deploy
 */
export interface AtParams {
  address:string;
  abi?:any;
  from?:string;
}

/**
 * When fetching an event emitter on a deployed contract instance, there
 * is an optional options object that can be passed with this shape
 *
 * NOTE: We do not support passing the optional callback as we inforce
 * the use of 'on' instead
 */
export interface EventEmitterOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}
