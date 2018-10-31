import Web3 from 'web3'
import { Contract, EventEmitter, EventLog } from 'web3/types'
import {
  Errors,
  DEPLOYMENT_GAS,
  GAS,
  GAS_PRICE
} from '../constants'
import {
  Keyed,
  ContractOptions,
  DeployParams,
  AtParams,
  EventEmitterOptions,
  PastEventFilterOptions,
} from '../interfaces'

export default abstract class implements Keyed {
  [key:string]: any
  public defaultAccount?:string;
  protected deployed?:Contract;

  /**
   * An optional passed in account will become the default account for transactions for this contract.
   * The same as calling `setDefaultAccount(account)`
   */
  constructor(account?:string) { account && this.setDefaultAccount(account) }

  /**
   * Mixin any passed in to, from, gas && gasPrice contract options and return
   */
  protected assignContractOptions(src:Keyed, opts?:ContractOptions): ContractOptions {
    if(opts) {
      // default our gas prices if not present
      if(!opts.gas) opts.gas = GAS // TODO change globally to gasLimit? i dislike 'gas'...
      if(!opts.gasPrice) opts.gasPrice = GAS_PRICE
      // delete sign so we don't pass it along
      delete opts.sign
      // copy src onto opts so that any overridden props take precedence
      return Object.assign(opts, src)
    }

    return src
  }

  /**
   * Similar to deployContract, but using the address of an already deployed instance.
   * Returns truthy if fetched
   *
   * TODO introduce try/catch error handling
   */
  protected async at(web3:Web3, params:AtParams, opts?:ContractOptions ): Promise<boolean> {
    const account = this.requireAccount(opts)

    this.deployed = await new web3.eth.Contract(
      params.abi,
      params.address,
      {
        from: params.from || account,
        gas: opts && opts.gas || DEPLOYMENT_GAS,
        gasPrice: opts && opts.gasPrice || GAS_PRICE // TODO this needs to have [env] vars for local, testNet, mainNet etc...
      }
    )

    return !!this.deployed
  }

  /**
   * Given an instantiated web3 instance and some params -  deploy this contract.
   * The deploy params are prepared by the subclass then passed here.
   * Contract options are optionally passed from the original caller.
   *
   * TODO introduce try/catch error handling
   */
  protected async deployContract(web3:Web3, params:DeployParams, opts?:ContractOptions): Promise<string> {
    const account = this.requireAccount(opts)

    this.deployed = await new web3.eth.Contract(
      params.abi,
      undefined,
      { gas: opts && opts.gas || DEPLOYMENT_GAS, gasPrice: opts && opts.gasPrice || GAS_PRICE })
    // it appears web3 is unhappy getting falsy in the no-args case, so we pass an empty array
    // TODO PR a correction
    .deploy({ data: params.bytecode, arguments: params.args || [] })
    .send({ from: account })

    // TODO TransactionReceipt for the above deploy as return rather than the address?
    return this.deployed.options.address
  }

  getAddress(): string {
    const deployed = this.requireDeployed()
    return deployed.options.address
  }

  getDeployed(): Contract|undefined { return this.deployed }

  /**
   * Given the name of a solidity event, return the subscription object for it. These
   * objects are event emitters with an `on` method which accepts:
   * * `data`
   * * `change`
   * * `error`
   * see the web3 @types EventEmitter
   */
  getEventEmitter(name:string, opts?:EventEmitterOptions): EventEmitter {
    const emitter = this.requireEmitter(name, opts)
    return emitter
  }

  getPastEvents(name:string, opts?:PastEventFilterOptions): Promise<EventLog[]> {
    const deployed = this.requireDeployed()

    // @ts-ignore:2345
    return deployed.getPastEvents(name, opts)
  }

  requireAccount(opts?:ContractOptions): string {
    const account = opts && opts.from || this.defaultAccount
    if (!account) throw Errors.NO_ACCOUNT_AVAILABLE
    return account
  }

  requireDeployed(): Contract {
    if (!this.deployed) throw Errors.CONTRACT_NOT_DEPLOYED
    return this.deployed
  }

  requireEmitter(name:string, opts?:EventEmitterOptions): EventEmitter {
    const deployed = this.requireDeployed()
    if (!deployed.events[name]) throw Errors.NO_SUCH_EVENT
    return deployed.events[name](opts)
  }

  setDefaultAccount(acct:string): void { this.defaultAccount = acct }

  // TODO use one amongst http/ws/ipc providers? Union type?
  setProvider(provider:any): void {
    const deployed = this.requireDeployed()
    deployed.setProvider(provider)
  }
}
