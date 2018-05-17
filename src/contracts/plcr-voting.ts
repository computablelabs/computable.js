import Web3 from 'web3'
import { GAS, GAS_PRICE, Errors } from '../../src/constants'
import { Keyed, ContractOptions, DeployParams } from '../interfaces'
import Deployable from '../abstracts/deployable'
import { Nos } from '../types'
import votingJson from '../../computable/build/contracts/PLCRVoting.json'
import { TransactionReceipt } from '../../node_modules/web3/types.d'
import { updateBytecode } from '../../src/helpers'

/**
 * Shape of the parameter object that should be passed to this class on deploy.
 * All three args are mandatory.
 */
interface VotingDeployParams {
  tokenAddress: string; // Address of the token refereced by this contract
  dllAddress: string; // Address of the deployed DLL contract this contract is `using`
  attributeStoreAddress: string; // Address of the deployed Attribute Store contract this contract is `using`
}

/**
 * PLCR Voting
 */

export default class extends Deployable {
  /**
   *
   */
  async commitVote(
    web3:Web3,
    pollId:string,
    voter:string,
    vote:Nos,
    tokens:Nos,
    salt:Nos
  ): Promise<TransactionReceipt> {
    const hash = this.getVoteSaltHash(web3, vote, salt)

  }
  /**
   * Pepare the deploy options, passing them along with the instantiated web3 and optional
   * contract options to the super class' _deploy method.
   * @see abstracts/deployable#_deploy
   */
  async deploy(web3:Web3, params:VotingDeployParams, opts?:ContractOptions): Promise<string> {
    // voting bytecode must be updated for both library dependencies
    let bytecode = updateBytecode(votingJson.bytecode, 'DLL', params.dllAddress.slice(2))

    bytecode = updateBytecode(bytecode, 'AttributeStore', params.attributeStoreAddress.slice(2))

    const dp:DeployParams = {
      abi: votingJson.abi,
      bytecode: bytecode,
      args:[ params.tokenAddress ]
    }

    return super.deployContract(web3, dp, opts)
  }

  /**
   * Reveals vote cast and secret salt used in generating commitHash to attribute committed tokens
   */
  async revealVote(pollID:Nos, vote:Nos, salt:Nos, opts?: ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts)

    return await deployed.methods.revealVote(pollID, vote, salt).send({ from: account })
  }
}


