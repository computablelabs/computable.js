import Web3 from 'web3'
import { ParameterDefaults, GAS, GAS_PRICE, Errors } from '../constants'
import Deployable from '../abstracts/deployable'
import { Nos } from '../types'
import parameterizerJson from '../../computable/build/contracts/Parameterizer.json'
// TODO PR web3 to export these properly
import { TransactionReceipt } from '../../node_modules/web3/types.d'
import {
  Keyed,
  ContractOptions,
  DeployParams,
  ParameterizerProposal,
} from '../interfaces'

/**
 * Shape of the parameter object that should be passed to this class during a deploy.
 * Token and Voting addresses are required, the rest will default if falsy.
 */
interface ParameterizerDeployParams {
  tokenAddress: string; // Address of the token which parameterizes this system
  votingAddress: string; // Address of the PLCR voting contract for the provided token
  minDeposit?:Nos; // Min deposit required for a listing to be included (whitelisted)
  pMinDeposit?:Nos; // Min deposit required to propose changes to the system (reparameterization etc...)
  applyStageLength?:Nos; // The length of time applicants must wait to be whitelisted
  pApplyStageLength?:Nos; // Length of time it will take reparameterization proposals to process
  dispensationPct?:Nos; // Percentage of a losing party's deposit paid to a winning party
  pDispensationPct?:Nos; // Percentage paid to the parameterizer from a losing party
  commitStageLen?:Nos; // Length of time for commit period in voting
  pCommitStageLen?:Nos; // Length of time for commit period in parameterizer
  revealStageLen?:Nos; // Length of time for reveal period in voting
  pRevealStageLen?:Nos; // Length of time for voting reveal period in parameterizer
  voteQuorum?:Nos; // "XX out of 100" type of majority required for vote success
  pVoteQuorum?:Nos; // "XX out of 100" type of majority required, in parameterizer, for vote success
}

/**
 * Parameterizer
 *
 * Token Holder Interface:
 * ----------------------
 * challengeReparameterization
 * claimReward
 * processProposal
 * proposeReparameterization
 *
 * Getters:
 * -------
 * canBeSet
 * challengeCanBeResolved
 * challengeWinnerReward
 * get
 * propExists
 * tokenClaims
 * voterReward
 *
 * Private:
 * -------
 * resolveChallenge
 * set
 */
export default class extends Deployable {
  /**
   * Determines if a proposal passed its application stage without a challenge
   */
  async canBeSet(propID:string): Promise<boolean> {
    const deployed = this.requireDeployed()

    return await deployed.methods.canBeSet(propID).call()
  }

  /**
   * Determines whether the provided proposal ID has a challenge which can be resolved
   */
  async challengeCanBeResolved(propID:string): Promise<boolean> {
    const deployed = this.requireDeployed()

    return await deployed.methods.challengeCanBeResolved(propID).call()
  }

  /**
   * Challenge a given proposal ID, and stake tokens to do so
   */
  async challengeReparameterization(propID:string, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.challengeReparameterization(propID).send({ from: account })
  }

  /**
   * Pepare the deploy options, passing them along with the instantiated web3 and optional
   * contract options to the super class' _deploy method.
   * @see abstracts/deployable#_deploy
   */
  async deploy(web3:Web3, params:ParameterizerDeployParams, opts?:ContractOptions): Promise<string> {
    const dp:DeployParams = {
      abi: parameterizerJson.abi,
      bytecode: parameterizerJson.bytecode,
      args:[
        params.tokenAddress,
        params.votingAddress,
        params.minDeposit || ParameterDefaults.MIN_DEPOSIT,
        params.pMinDeposit || ParameterDefaults.P_MIN_DEPOSIT,
        params.applyStageLength || ParameterDefaults.APPLY_STAGE_LENGTH,
        params.pApplyStageLength || ParameterDefaults.P_APPLY_STAGE_LENGTH,
        params.commitStageLen || ParameterDefaults.COMMIT_STAGE_LENGTH,
        params.pCommitStageLen || ParameterDefaults.P_COMMIT_STAGE_LENGTH,
        params.revealStageLen || ParameterDefaults.REVEAL_STAGE_LENGTH,
        params.pRevealStageLen || ParameterDefaults.P_REVEAL_STAGE_LENGTH,
        params.dispensationPct || ParameterDefaults.DISPENSATION_PCT,
        params.pDispensationPct || ParameterDefaults.P_DISPENSATION_PCT,
        params.voteQuorum || ParameterDefaults.VOTE_QUORUM,
        params.pVoteQuorum || ParameterDefaults.P_VOTE_QUORUM
      ]
    }

    return super.deployContract(web3, dp, opts)
  }

  /**
   * Fetch a given attribute as it is set on the deployed contract
   */
  async get(attribute:string): Promise<Nos> {
    const deployed = this.requireDeployed()

    return await deployed.methods.get(attribute).call()
  }

  /**
   * For the given proposal ID, set it, resolve its challenge, or delete it depending on whether it can be set,
   * has a challenge which can be resolved, or if its "process by" date has passed
   */
  async processProposal(propID:string, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.processProposal(propID).send({ from: account })
  }

  /**
   * Determines whether a proposal exists for the provided proposal ID
   */
  async propExists(propID:string): Promise<boolean> {
    const deployed = this.requireDeployed()

    return await deployed.methods.propExists(propID).call()
  }

  /**
   * Proposals map pollIDs to intended data change if poll passes
   */
  async proposals(propID:string): Promise<ParameterizerProposal> {
    const deployed = this.requireDeployed()

    return await deployed.methods.proposals(propID).call()
  }

  /**
   * Propose a change of the given attribute to the given value
   */
  async proposeReparameterization(attribute:string, val:Nos, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.proposeReparameterization(attribute, val).send({ from: account })
  }
}
