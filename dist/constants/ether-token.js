"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETHER_TOKEN_ABI = [{ "name": "Approval", "inputs": [{ "type": "address", "name": "owner", "indexed": true }, { "type": "address", "name": "spender", "indexed": true }, { "type": "uint256", "name": "amount", "indexed": false, "unit": "wei" }], "anonymous": false, "type": "event" }, { "name": "Deposited", "inputs": [{ "type": "address", "name": "source", "indexed": true }, { "type": "uint256", "name": "amount", "indexed": false, "unit": "wei" }], "anonymous": false, "type": "event" }, { "name": "Transfer", "inputs": [{ "type": "address", "name": "source", "indexed": true }, { "type": "address", "name": "to", "indexed": true }, { "type": "uint256", "name": "amount", "indexed": false, "unit": "wei" }], "anonymous": false, "type": "event" }, { "name": "Withdrawn", "inputs": [{ "type": "address", "name": "to", "indexed": true }, { "type": "uint256", "name": "amount", "indexed": false, "unit": "wei" }], "anonymous": false, "type": "event" }, { "outputs": [], "inputs": [], "constant": false, "payable": false, "type": "constructor" }, { "name": "allowance", "outputs": [{ "type": "uint256", "unit": "wei", "name": "out" }], "inputs": [{ "type": "address", "name": "owner" }, { "type": "address", "name": "spender" }], "constant": true, "payable": false, "type": "function", "gas": 859 }, { "name": "approve", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "spender" }, { "type": "uint256", "unit": "wei", "name": "amount" }], "constant": false, "payable": false, "type": "function", "gas": 37763 }, { "name": "balanceOf", "outputs": [{ "type": "uint256", "unit": "wei", "name": "out" }], "inputs": [{ "type": "address", "name": "owner" }], "constant": true, "payable": false, "type": "function", "gas": 765 }, { "name": "decreaseAllowance", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "spender" }, { "type": "uint256", "unit": "wei", "name": "amount" }], "constant": false, "payable": false, "type": "function", "gas": 38801 }, { "name": "deposit", "outputs": [], "inputs": [], "constant": false, "payable": true, "type": "function", "gas": 73694 }, { "name": "increaseAllowance", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "spender" }, { "type": "uint256", "unit": "wei", "name": "amount" }], "constant": false, "payable": false, "type": "function", "gas": 39067 }, { "name": "totalSupply", "outputs": [{ "type": "uint256", "unit": "wei", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 731 }, { "name": "transfer", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "to" }, { "type": "uint256", "unit": "wei", "name": "amount" }], "constant": false, "payable": false, "type": "function", "gas": 74365 }, { "name": "transferFrom", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "source" }, { "type": "address", "name": "to" }, { "type": "uint256", "unit": "wei", "name": "amount" }], "constant": false, "payable": false, "type": "function", "gas": 110329 }, { "name": "withdraw", "outputs": [], "inputs": [{ "type": "uint256", "unit": "wei", "name": "amount" }], "constant": false, "payable": false, "type": "function", "gas": 108350 }, { "name": "decimals", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 851 }, { "name": "symbol", "outputs": [{ "type": "string", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 6904 }];
