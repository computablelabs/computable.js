import { Nos } from '../types';
export interface Token {
    address: string;
    name: string;
    symbol: string;
    supply: Nos;
    decimals: Nos;
}
export interface TokenHolder {
    address: string;
    amount: Nos;
}
/**
 * Note that the 3 "Vanity" properties are not mandatory, and me be unused by some implementations
 */
export interface Eip20DeployParams {
    supply?: Nos;
    name?: string;
    decimals?: Nos;
    symbol?: Nos;
}
