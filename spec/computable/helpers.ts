import Web3 from 'web3'
import { Contract } from '../../node_modules/web3/types.d'
import tokenJson from '../../computable/build/contracts/EIP20.json'
import dllJson from '../../computable/build/contracts/DLL.json'
import storeJson from '../../computable/build/contracts/AttributeStore.json'
import parameterizerJson from '../../computable/build/contracts/Parameterizer.json'
import votingJson from '../../computable/build/contracts/PLCRVoting.json'
import {
  ParameterDefaults,
  Token,
  GAS,
  GAS_PRICE,
} from '../../src/constants'

// the paramaterizer takes a massive number of args, here are some defaults for it
function getDefaults(): any[] {
  return [
    ParameterDefaults.MIN_DEPOSIT,
    ParameterDefaults.P_MIN_DEPOSIT,
    ParameterDefaults.APPLY_STAGE_LENGTH,
    ParameterDefaults.P_APPLY_STAGE_LENGTH,
    ParameterDefaults.COMMIT_STAGE_LENGTH,
    ParameterDefaults.P_COMMIT_STAGE_LENGTH,
    ParameterDefaults.REVEAL_STAGE_LENGTH,
    ParameterDefaults.P_REVEAL_STAGE_LENGTH,
    ParameterDefaults.DISPENSATION_PCT,
    ParameterDefaults.P_DISPENSATION_PCT,
    ParameterDefaults.VOTE_QUORUM,
    ParameterDefaults.P_VOTE_QUORUM
  ]
}

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
  const deployed = await new web3.eth.Contract(abi, undefined, {gasPrice: GAS_PRICE, gas: GAS })
    .deploy({ data: bytecode, arguments: args })
    .send({ from: account })

  return deployed
}

export async function deployAttributeStore(web3:Web3, account:string): Promise<Contract> {
  return deploy(web3, account, storeJson.abi, storeJson.bytecode)
}

export async function deployDll(web3:Web3, account:string): Promise<Contract> {
  return deploy(web3, account, dllJson.abi, dllJson.bytecode)
}



export async function deployParameterizer(
  web3:Web3,
  account:string,
  tokenAddress:string,
  votingAddress:string
): Promise<Contract> {
  const args = [tokenAddress, votingAddress, ...getDefaults()]
  return deploy(web3, account, parameterizerJson.abi, parameterizerJson.bytecode, args)
}

export async function deployToken(web3:Web3, account:string): Promise<Contract> {
  const args = [Token.supply, Token.name, Token.decimals, Token.symbol]
  return deploy(web3, account, tokenJson.abi, tokenJson.bytecode, args)
}

/**
 * Contracts that employ the solidity `using` feature for a `Library` will need their bytecode updated
 * with the deployed address of the stated "linked" library. We do that by searching and replacing the
 * bytecode string with the Ethereum standard (and poorly documented!) `__<Name>__*`. Note that placeholder
 * will always add up to exactly 40 chars. This means we need to slice off the first 2 (0x) chars of the
 * deployed address given to us.
 */
export async function deployVoting(
  web3:Web3,
  account:string,
  dllAddress:string,
  attributeStoreAddress:string,
  tokenAddress:string
): Promise<Contract> {
  let votingBytecode = updateBytecode(votingJson.bytecode, 'DLL', dllAddress.slice(2))
  votingBytecode = updateBytecode(votingBytecode, 'AttributeStore', attributeStoreAddress.slice(2))

  // Note that arguments are always an array, even when unary
  return deploy(web3, account, votingJson.abi, votingBytecode, [tokenAddress])
}

function updateBytecode(bytecode:string, library:string, address:string): string {
  return bytecode.replace(new RegExp(`__${library}__+`, 'g'), address)
}
