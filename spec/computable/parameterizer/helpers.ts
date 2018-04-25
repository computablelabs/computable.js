import { ParameterDefaults } from '../../../src/constants'

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
