import Web3 from 'web3'
import { Contract } from 'web3/types.d'
import dllJson from '../../computable/build/contracts/DLL.json'
import storeJson from '../../computable/build/contracts/AttributeStore.json'
import {
  Token,
  GAS,
  GAS_PRICE,
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
  return await new web3.eth.Contract(abi, undefined, {gasPrice: GAS_PRICE, gas: GAS })
    .deploy({ data: bytecode, arguments: args })
    .send({ from: account })
}

export async function deployAttributeStore(web3:Web3, account:string): Promise<Contract> {
  return deploy(web3, account, storeJson.abi, storeJson.bytecode)
}

export async function deployDll(web3:Web3, account:string): Promise<Contract> {
  return deploy(web3, account, dllJson.abi, dllJson.bytecode)
}

/**
 * Contracts that employ the solidity `using` feature for a `Library` will need their bytecode updated
 * with the deployed address of the stated "linked" library. We do that by searching and replacing the
 * bytecode string with the Ethereum standard (and poorly documented!) `__<Name>__*`. Note that placeholder
 * will always add up to exactly 40 chars. This means we need to slice off the first 2 (0x) chars of the
 * deployed address given to us.
 */
export function updateBytecode(bytecode:string, library:string, address:string): string {
  return bytecode.replace(new RegExp(`__${library}__+`, 'g'), address)
}
