import Web3 from 'web3'
import { TransactionReceipt } from 'web3/types'
import { ParameterDefaults, GAS, GAS_PRICE, Errors } from '../constants'
import Deployable from '../abstracts/deployable'
import { Nos } from '../@types'
import parameterizerJson from '../../computable/build/contracts/Parameterizer.json'
// TODO PR web3 to export these properly
import {
  Keyed,
  ContractOptions,
  DeployParams,
  AtParams,
  ParameterizerDeployParams,
  ParameterizerProposal,
} from '../interfaces'

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
   * Set our deployed refernce from an already deployed contract
   * @see abstracts/deployable#at
   */
  at(web3:Web3, params:AtParams, opts?:ContractOptions): Promise<boolean> {
    const ap:AtParams = {
      address: params.address,
      abi: parameterizerJson.abi,
      from: params.from,
    }

    return super.at(web3, ap, opts)
  }
  /**
   * Determines if a proposal passed its application stage without a challenge
   */
  canBeSet(propID:string): Promise<boolean> {
    const deployed = this.requireDeployed()

    return deployed.methods.canBeSet(propID).call()
  }

  /**
   * Determines whether the provided proposal ID has a challenge which can be resolved
   */
  challengeCanBeResolved(propID:string): Promise<boolean> {
    const deployed = this.requireDeployed()

    return deployed.methods.challengeCanBeResolved(propID).call()
  }

  /**
   * Challenge a given proposal ID, and stake tokens to do so
   */
  challengeReparameterization(propID:string, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return deployed.methods.challengeReparameterization(propID).send({ from: account })
  }

  /**
   * Pepare the deploy options, passing them along with the instantiated web3 and optional
   * contract options to the super class' _deploy method.
   * @see abstracts/deployable#deployContract
   */
  deploy(web3:Web3, params:ParameterizerDeployParams, opts?:ContractOptions): Promise<string> {
    const dp:DeployParams = {
      abi: parameterizerJson.abi,
      bytecode: parameterizerJson.bytecode,
      args:[
        params.tokenAddress,
        params.votingAddress,
        params.minDeposit || ParameterDefaults.MIN_DEPOSIT,
        params.pMinDeposit || ParameterDefaults.P_MIN_DEPOSIT,
        params.applyStageLen || ParameterDefaults.APPLY_STAGE_LENGTH,
        params.pApplyStageLen || ParameterDefaults.P_APPLY_STAGE_LENGTH,
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
  get(attribute:string): Promise<Nos> {
    const deployed = this.requireDeployed()

    return deployed.methods.get(attribute).call()
  }

  /**
   * For the given proposal ID, set it, resolve its challenge, or delete it depending on whether it can be set,
   * has a challenge which can be resolved, or if its "process by" date has passed
   */
  processProposal(propID:string, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return deployed.methods.processProposal(propID).send({ from: account })
  }

  /**
   * Determines whether a proposal exists for the provided proposal ID
   */
  propExists(propID:string): Promise<boolean> {
    const deployed = this.requireDeployed()

    return deployed.methods.propExists(propID).call()
  }

  /**
   * Proposals map pollIDs to intended data change if poll passes
   */
  proposals(propID:string): Promise<ParameterizerProposal> {
    const deployed = this.requireDeployed()

    return deployed.methods.proposals(propID).call()
  }

  /**
   * Propose a change of the given attribute to the given value
   */
  proposeReparameterization(attribute:string, val:Nos, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return deployed.methods.proposeReparameterization(attribute, val).send({ from: account })
  }
}
