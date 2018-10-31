import Web3 from 'web3'
import { TransactionReceipt } from 'web3/types'
import { GAS, GAS_PRICE, Errors } from '../constants'
import Deployable from '../abstracts/deployable'
import { Nos } from '../@types'
import votingJson from '../../computable/build/contracts/PLCRVoting.json'
import { updateBytecode, sendSignedTransaction } from '../helpers'
import {
  Keyed,
  ContractOptions,
  VotingDeployParams,
  DeployParams,
  AtParams,
} from '../interfaces'

/**
 * PLCR Voting
 */

export default class extends Deployable {
  /**
   * Set our deployed refernce from an already deployed contract
   * @see abstracts/deployable#at
   */
  at(web3:Web3, params:AtParams, opts?:ContractOptions): Promise<boolean> {
    const ap:AtParams = {
      address: params.address,
      abi: votingJson.abi,
      from: params.from,
    }

    return super.at(web3, ap, opts)
  }

  /**
   * Commits vote using a created hash with secret salt to conceal vote until reveal
   */
  async commitVote(
    web3:Web3,
    id:Nos,
    voter:string,
    vote:Nos,
    tokens:Nos,
    salt:Nos,
    opts?:ContractOptions
  ): Promise<TransactionReceipt> {
    const account = this.requireAccount(opts),
      deployed = this.requireDeployed(),
      hash = this.getVoteSaltHash(web3, vote, salt),
      options = this.assignContractOptions({ from: voter }, opts)

    let tx1, prevID// TODO use these to verify intermediate steps or catch errors?

    tx1 = await this.requestVotingRights(web3, tokens, options)
    prevID = await this.getInsertPointForNumTokens(voter, tokens, id)

    if (options.estimateGas) return deployed.methods.commitVote(id, hash, tokens, prevID).estimateGas()
    else if (options.sign) {
      const encoded = deployed.methods.commitVote(id, hash, tokens, prevID).encodeABI()
      return sendSignedTransaction(web3, deployed.options.address, account, encoded, options)
    } else return deployed.methods.commitVote(id, hash, tokens, prevID).send(options)
  }

  /**
   * Pepare the deploy options, passing them along with the instantiated web3 and optional
   * contract options to the super class' _deploy method.
   * @see abstracts/deployable#_deploy
   */
  deploy(web3:Web3, params:VotingDeployParams, opts?:ContractOptions): Promise<string> {
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
   * Takes the last node in the user's DLL and iterates backwards through the list searching
   * for a node with a value less than or equal to the provided tokens value. When such a node
   * is found, if the provided poll ID matches the found nodeID, this operation is an in-place
   * update. In that case, return the previous node of the node being updated. Otherwise return the
   * first node that was found with a value less than or equal to the provided tokens.
   */
  getInsertPointForNumTokens(voter:string, tokens:Nos, id:Nos): Promise<Nos> {
    const deployed = this.requireDeployed()

    return deployed.methods.getInsertPointForNumTokens(voter, tokens, id).call()
  }

  /**
   * return a sha3 hash of the vote and salt values
   */
  getVoteSaltHash(web3:Web3, vote:Nos, salt:Nos): string {
    // TODO remove this when our Web3 PR is merged
    // @ts-ignore:2554
    return web3.utils.soliditySha3({ t: 'uint', v: vote }, { t: 'uint', v: salt })
  }

  /**
   * Loads a number of ERC20 tokens into the voting contract for one-to-one voting rights.
   * Assumes that `account` has approved the voting contract to spend on their behalf.
   */
  requestVotingRights(web3:Web3, tokens:Nos, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts),
      options = this.assignContractOptions({ from: account }, opts)

    if (options.estimateGas) return deployed.methods.requestVotingRights(tokens).estimateGas()
    else if (options.sign) {
      const encoded = deployed.methods.requestVotingRights(tokens).encodeABI()
      return sendSignedTransaction(web3, deployed.options.address, account, encoded, options)
    } else return deployed.methods.requestVotingRights(tokens).send(options)
  }

  /**
   * Withdraws ERC20 tokens from the voting contract to revoke one-to-one voting rights.
   */
  withdrawVotingRights(web3:Web3, tokens:Nos, opts?:ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts),
      options = this.assignContractOptions({ from: account }, opts)

    if (options.estimateGas) return deployed.methods.withdrawVotingRights(tokens).estimateGas()
    else if (options.sign) {
      const encoded = deployed.methods.withdrawVotingRights(tokens).encodeABI()
      return sendSignedTransaction(web3, deployed.options.address, account, encoded, options)
    } else return deployed.methods.withdrawVotingRights(tokens).send(options)
  }

  /**
   * Reveals vote cast and secret salt used in generating commitHash to attribute committed tokens
   */
  revealVote(web3:Web3, id:Nos, vote:Nos, salt:Nos, opts?: ContractOptions): Promise<TransactionReceipt> {
    const deployed = this.requireDeployed(),
      account = this.requireAccount(opts),
      options = this.assignContractOptions({ from: account }, opts)


    if (options.estimateGas) return deployed.methods.revealVote(id, vote, salt).estimateGas()
    else if (options.sign) {
      const encoded = deployed.methods.revealVote(id, vote, salt).encodeABI()
      return sendSignedTransaction(web3, deployed.options.address, account, encoded, options)
    } else return deployed.methods.revealVote(id, vote, salt).send(options)
  }

  /**
   * Checks if the commit period is still active for the specified poll.
   */
  commitPeriodActive(id:Nos) : Promise<boolean> {
    const deployed = this.requireDeployed()

    return deployed.methods.commitPeriodActive(id).call()
  }

  /**
   * Checks if the reveal period is still active for the specified poll.
   */
  revealPeriodActive(id:Nos) : Promise<boolean> {
    const deployed = this.requireDeployed()

    return deployed.methods.revealPeriodActive(id).call()
  }
}

