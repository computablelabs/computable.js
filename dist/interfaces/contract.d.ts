import { BlockType } from 'web3/types.d';
export interface ContractOptions {
    to?: string;
    from?: string;
    gas?: any;
    gasPrice?: any;
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
