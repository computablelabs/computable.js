import Web3 from 'web3';
import { Nos } from '../types';
export declare function maybeParseInt(arg: Nos, radix?: number): number;
export declare function increaseTime(provider: any, seconds: number): Promise<any>;
export declare function stringToBytes(web3: Web3, str: string): string;
