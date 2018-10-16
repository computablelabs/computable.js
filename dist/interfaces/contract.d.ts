import { BlockType } from 'web3/types';
export interface ContractOptions {
    to?: string;
    from?: string;
    gas?: any;
    gasPrice?: any;
    sign?: string;
}
export interface DeployParams {
    abi: any;
    bytecode: string;
    args?: any[];
}
export interface AtParams {
    address: string;
    abi?: any;
    from?: string;
}
export interface EventEmitterOptions {
    filter?: object;
    fromBlock?: BlockType;
    topics?: string[];
}
