import { Transaction } from 'web3/types'
import { TransactOpts } from '../interfaces'

export type Nos = number | string
export type Nosob = number | string | boolean

export type Return = [Transaction, TransactOpts]
