import Web3 from 'web3'
import { Contract } from 'web3/types'
import {
  GAS_PRICE,
  DEPLOY_GAS,
} from '../constants'

/**
 * The abstracted pattern for deploying a compiled contract. Note that the `args` argument is
 * defaulted to an empty array so if your contract has no args, there is no need to pass any
 */
async function deploy(
  web3:Web3,
  account:string,
  abi:any,
  bytecode:string,
  args: any[] = []
): Promise<Contract> {
  let price = String(GAS_PRICE)

  return await new web3.eth.Contract(abi, undefined)
    .deploy({ data: bytecode, arguments: args })
    .send({ from: account, gas: DEPLOY_GAS, gasPrice: String(GAS_PRICE) })
}
