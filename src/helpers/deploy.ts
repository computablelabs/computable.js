import Web3 from 'web3'
import { Contract } from 'web3/types'
import { readFileSync } from 'fs'
import { join } from 'path'
import {
  GAS_PRICE,
  DEPLOY_GAS,
} from '../constants'

/**
 * The abstracted pattern for deploying a compiled contract. Note that the `args` argument is
 * defaulted to an empty array so if your contract has no args, there is no need to pass any
 */
export async function deploy(
  w3:Web3,
  account:string,
  abi:any,
  bytecode:string,
  args: any[] = []
): Promise<Contract> {

  return await new w3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: args })
    .send({ from: account, gas: DEPLOY_GAS, gasPrice: String(GAS_PRICE) })
}

/*
 * Use node to read the .bin file and return the contents as a string
 * @param name We only expect the test to pass the name of the dir/file (since they are the same)
 * as we let this helper extrapolate the path
 * @returns The bytecode as a string
 * NOTE: We trim() any unexpected chars as the vyper compiler puts a newline in the output
 */
export function readBytecode(name:string): string {
  const path = join(__dirname, `../contracts/${name}/${name}.bin`)
  return readFileSync(path).toString().trim()
}
