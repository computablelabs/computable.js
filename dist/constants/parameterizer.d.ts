export declare enum ParameterKinds {
    PRICE_FLOOR = 2,
    SPREAD = 4,
    LIST_REWARD = 5,
    STAKE = 1,
    VOTE_BY = 7,
    PLURALITY = 6,
    BACKEND_PAYMENT = 8,
    MAKER_PAYMENT = 9,
    COST_PER_BYTE = 11
}
export declare const REPARAM: number;
export declare const PARAMETERIZER_ABI: ({
    "name": string;
    "inputs": {
        "type": string;
        "name": string;
        "indexed": boolean;
    }[];
    "anonymous": boolean;
    "type": string;
    "outputs"?: undefined;
    "constant"?: undefined;
    "payable"?: undefined;
    "gas"?: undefined;
} | {
    "outputs": never[];
    "inputs": ({
        "type": string;
        "name": string;
        "unit"?: undefined;
    } | {
        "type": string;
        "unit": string;
        "name": string;
    })[];
    "constant": boolean;
    "payable": boolean;
    "type": string;
    "name"?: undefined;
    "anonymous"?: undefined;
    "gas"?: undefined;
} | {
    "name": string;
    "outputs": {
        "type": string;
        "unit": string;
        "name": string;
    }[];
    "inputs": never[];
    "constant": boolean;
    "payable": boolean;
    "type": string;
    "gas": number;
    "anonymous"?: undefined;
} | {
    "name": string;
    "outputs": {
        "type": string;
        "name": string;
    }[];
    "inputs": {
        "type": string;
        "name": string;
    }[];
    "constant": boolean;
    "payable": boolean;
    "type": string;
    "gas": number;
    "anonymous"?: undefined;
})[];
