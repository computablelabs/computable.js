"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParameterKinds;
(function (ParameterKinds) {
    ParameterKinds[ParameterKinds["PRICE_FLOOR"] = 2] = "PRICE_FLOOR";
    ParameterKinds[ParameterKinds["SPREAD"] = 4] = "SPREAD";
    ParameterKinds[ParameterKinds["LIST_REWARD"] = 5] = "LIST_REWARD";
    ParameterKinds[ParameterKinds["STAKE"] = 1] = "STAKE";
    ParameterKinds[ParameterKinds["VOTE_BY"] = 7] = "VOTE_BY";
    ParameterKinds[ParameterKinds["PLURALITY"] = 6] = "PLURALITY";
    ParameterKinds[ParameterKinds["BACKEND_PAYMENT"] = 8] = "BACKEND_PAYMENT";
    ParameterKinds[ParameterKinds["MAKER_PAYMENT"] = 9] = "MAKER_PAYMENT";
    ParameterKinds[ParameterKinds["COST_PER_BYTE"] = 11] = "COST_PER_BYTE";
})(ParameterKinds = exports.ParameterKinds || (exports.ParameterKinds = {}));
exports.REPARAM = 3;
exports.PARAMETERIZER_ABI = [{ "name": "ReparamProposed", "inputs": [{ "type": "address", "name": "owner", "indexed": true }, { "type": "bytes32", "name": "hash", "indexed": true }, { "type": "uint256", "name": "param", "indexed": true }, { "type": "uint256", "name": "value", "indexed": false }], "anonymous": false, "type": "event" }, { "name": "ReparamFailed", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }, { "type": "uint256", "name": "param", "indexed": true }, { "type": "uint256", "name": "value", "indexed": false }], "anonymous": false, "type": "event" }, { "name": "ReparamSucceeded", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }, { "type": "uint256", "name": "param", "indexed": true }, { "type": "uint256", "name": "value", "indexed": false }], "anonymous": false, "type": "event" }, { "outputs": [], "inputs": [{ "type": "address", "name": "v_addr" }, { "type": "uint256", "name": "pr_fl", "unit": "wei" }, { "type": "uint256", "name": "spd" }, { "type": "uint256", "name": "list_re", "unit": "wei" }, { "type": "uint256", "name": "stk", "unit": "wei" }, { "type": "uint256", "name": "vote_by_d", "unit": "sec" }, { "type": "uint256", "name": "pl" }, { "type": "uint256", "name": "back_p" }, { "type": "uint256", "name": "maker_p" }, { "type": "uint256", "name": "cost", "unit": "wei" }], "constant": false, "payable": false, "type": "constructor" }, { "name": "getBackendPayment", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 483 }, { "name": "getMakerPayment", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 513 }, { "name": "getReservePayment", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 2766 }, { "name": "getCostPerByte", "outputs": [{ "type": "uint256", "name": "out", "unit": "wei" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 573 }, { "name": "getStake", "outputs": [{ "type": "uint256", "name": "out", "unit": "wei" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 603 }, { "name": "getPriceFloor", "outputs": [{ "type": "uint256", "name": "out", "unit": "wei" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 633 }, { "name": "getHash", "outputs": [{ "type": "bytes32", "name": "out" }], "inputs": [{ "type": "uint256", "name": "param" }, { "type": "uint256", "name": "value" }], "constant": true, "payable": false, "type": "function", "gas": 722 }, { "name": "getSpread", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 693 }, { "name": "getListReward", "outputs": [{ "type": "uint256", "name": "out", "unit": "wei" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 723 }, { "name": "getPlurality", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 753 }, { "name": "getReparam", "outputs": [{ "type": "uint256", "name": "out" }, { "type": "uint256", "name": "out" }], "inputs": [{ "type": "bytes32", "name": "hash" }], "constant": true, "payable": false, "type": "function", "gas": 1459 }, { "name": "getVoteBy", "outputs": [{ "type": "uint256", "name": "out", "unit": "sec" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 813 }, { "name": "reparameterize", "outputs": [], "inputs": [{ "type": "uint256", "name": "param" }, { "type": "uint256", "name": "value" }], "constant": false, "payable": false, "type": "function", "gas": 78259 }, { "name": "resolveReparam", "outputs": [], "inputs": [{ "type": "bytes32", "name": "hash" }], "constant": false, "payable": false, "type": "function", "gas": 87261 }];