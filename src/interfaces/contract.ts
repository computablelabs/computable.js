import { BlockType } from 'web3/types'
import { Nos } from '../@types'

/**
 * Contracts have some repeatedly used options which may, or may not be passed
 * to their methods.
 *
 * TODO <any> for gas types required because of the web3 ts def - correct that and PR
 */
export interface TransactOpts {
  to?:string;
  from?:string;
  gas?:any; //gasLimit
  gasPrice?:any;
  value?: any;
  data?: any;
}
