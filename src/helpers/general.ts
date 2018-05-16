import { Nos } from '../types'

export function maybeParseInt(arg:Nos, radix=10): number {
  return typeof arg === 'string' ? parseInt(arg, radix) : arg
}
