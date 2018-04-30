import { Contract } from '../../node_modules/web3/types.d'
import tokenJson from '../../computable/build/contracts/EIP20.json'
import parameterizerJson from '../../computable/build/contracts/Parameterizer.json'
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

export async function deployToken(web3:any, account:string): Promise<Contract> {
  const eip20 = await new web3.eth.Contract(tokenJson.abi, undefined, { gasPrice: GAS_PRICE, gas: GAS })
    .deploy({ data: tokenJson.bytecode, arguments: [
      Token.supply,
      Token.name,
      Token.decimals,
      Token.symbol
    ]})
    .send({ from: account })

  return eip20
}

export async function deployParameterizer(web3:any, account:string, tokenAddress:string, plcrAddress:string): Promise<Contract> {
  const parameterizer = await new web3.eth.Contract(parameterizerJson.abi, undefined, { gasPrice: GAS_PRICE, gas: GAS })
    .deploy({ data: parameterizerJson.bytecode, arguments: [
      tokenAddress,
      plcrAddress,
      ...getDefaults()
    ]})
    .send({ from: account }) 

  return parameterizer
}
