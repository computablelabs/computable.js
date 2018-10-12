import Web3 from 'web3'
import { TransactionReceipt } from 'web3/types.d'
import Tx from 'ethereumjs-tx'
import { Nos } from '../@types'
import { ContractOptions } from '../interfaces'
import { ONE_MILLION } from '../constants'

export function maybeParseInt(arg:Nos, radix=10): number {
  return typeof arg === 'string' ? parseInt(arg, radix) : arg
}

// NOTE the web3 typed IProvider is incomplete (no sendAsync etc...) TODO flush it out
export function increaseTime(provider:any, seconds:number): Promise<any> {
  return new Promise((resolve, reject) =>
    provider.send({
      id: new Date().getSeconds(),
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [seconds],
    }, (err:any, data:any) => {
      if (err) reject(err)
      resolve(data)
    })
  ).then((result) => new Promise((resolve, reject) =>
    provider.send({
      id: new Date().getSeconds(),
      jsonrpc: '2.0',
      method: 'evm_mine',
      params: [],
    }, (err:any, data:any) => {
      if (err) reject(err)
      resolve({ increaseTime: result, mine: data })
    }))
  )
}

export function stringToBytes(web3:Web3, str:string): string {
  return web3.utils.toHex(str)
}

// TODO i think encoded may be an array of strings?
export async function sendSignedTransaction(web3:Web3, to:string, from:string, encoded:string, opts:ContractOptions): Promise<TransactionReceipt> {
  const rawTx = {
    to: web3.utils.toHex(to),
    from: web3.utils.toHex(from),
    nonce: await web3.eth.getTransactionCount(from),
    data: web3.utils.toHex(encoded),
    gasLimit: opts.gas,
    gasPrice: opts.gasPrice,
  }

  let tx = new Tx(rawTx)
  // @ts-ignore 2345 - we do actually know opts.sign in here at this point
  tx.sign(new Buffer(opts.sign, 'hex'))
  // @ts-ignore 2322 - TODO we could define the buffer interface here to have 'raw'
  tx = tx.serialize().toString('hex')

  return web3.eth.sendSignedTransaction(`0x${tx}`)
}
