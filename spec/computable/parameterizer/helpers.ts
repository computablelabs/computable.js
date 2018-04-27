import { ParameterDefaults } from '../../../src/constants'

// the paramaterizer takes a massive number of args, here are some defaults for it
export function getDefaults(): any[] {
  return [
    ParameterDefaults.MinDeposit,
    ParameterDefaults.PMinDeposit,
    ParameterDefaults.ApplyStageLength,
    ParameterDefaults.PApplyStageLength,
    ParameterDefaults.CommitStageLength,
    ParameterDefaults.PCommitStageLength,
    ParameterDefaults.RevealStageLength,
    ParameterDefaults.PRevealStageLength,
    ParameterDefaults.DispensationPct,
    ParameterDefaults.PDispensationPct,
    ParameterDefaults.VoteQuorum,
    ParameterDefaults.PVoteQuorum
  ]
}

// NOTE the web3 typed IProvider is incomplete (no sendAsync etc...) TODO flush it out
export function increaseTime(provider: any, seconds: number): Promise<any> {
  return new Promise((resolve, reject) =>
    provider.sendAsync({
      method: 'evm_increaseTime',
      params: [seconds],
    }, (err:any, data:any) => {
      if (err) reject(err)
      resolve(data)
    })
  ).then((result) => new Promise((resolve, reject) =>
    provider.sendAsync({
      method: 'evm_mine',
      params: [],
    }, (err:any, data:any) => {
      if (err) reject(err)
      resolve({ increaseTime: result, mine: data })
    }))
  )
}
