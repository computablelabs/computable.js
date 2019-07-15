"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETHER_TOKEN_ABI = [{ "name": "Approval", "inputs": [{ "type": "address", "name": "owner", "indexed": true }, { "type": "address", "name": "spender", "indexed": true }, { "type": "uint256", "name": "amount", "indexed": false, "unit": "wei" }], "anonymous": false, "type": "event" }, { "name": "Deposited", "inputs": [{ "type": "address", "name": "source", "indexed": true }, { "type": "uint256", "name": "amount", "indexed": false, "unit": "wei" }], "anonymous": false, "type": "event" }, { "name": "Transfer", "inputs": [{ "type": "address", "name": "source", "indexed": true }, { "type": "address", "name": "to", "indexed": true }, { "type": "uint256", "name": "amount", "indexed": false, "unit": "wei" }], "anonymous": false, "type": "event" }, { "name": "Withdrawn", "inputs": [{ "type": "address", "name": "to", "indexed": true }, { "type": "uint256", "name": "amount", "indexed": false, "unit": "wei" }], "anonymous": false, "type": "event" }, { "outputs": [], "inputs": [{ "type": "address", "name": "initial_account" }, { "type": "uint256", "name": "initial_balance", "unit": "wei" }], "constant": false, "payable": false, "type": "constructor" }, { "name": "allowance", "outputs": [{ "type": "uint256", "name": "out", "unit": "wei" }], "inputs": [{ "type": "address", "name": "owner" }, { "type": "address", "name": "spender" }], "constant": true, "payable": false, "type": "function", "gas": 815 }, { "name": "approve", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "spender" }, { "type": "uint256", "name": "amount", "unit": "wei" }], "constant": false, "payable": false, "type": "function", "gas": 37719 }, { "name": "balanceOf", "outputs": [{ "type": "uint256", "name": "out", "unit": "wei" }], "inputs": [{ "type": "address", "name": "owner" }], "constant": true, "payable": false, "type": "function", "gas": 715 }, { "name": "decreaseApproval", "outputs": [], "inputs": [{ "type": "address", "name": "spender" }, { "type": "uint256", "name": "amount", "unit": "wei" }], "constant": false, "payable": false, "type": "function", "gas": 38742 }, { "name": "deposit", "outputs": [], "inputs": [], "constant": false, "payable": true, "type": "function", "gas": 73656 }, { "name": "increaseApproval", "outputs": [], "inputs": [{ "type": "address", "name": "spender" }, { "type": "uint256", "name": "amount", "unit": "wei" }], "constant": false, "payable": false, "type": "function", "gas": 39008 }, { "name": "totalSupply", "outputs": [{ "type": "uint256", "name": "out", "unit": "wei" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 663 }, { "name": "transfer", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "to" }, { "type": "uint256", "name": "amount", "unit": "wei" }], "constant": false, "payable": false, "type": "function", "gas": 74321 }, { "name": "transferFrom", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "address", "name": "source" }, { "type": "address", "name": "to" }, { "type": "uint256", "name": "amount", "unit": "wei" }], "constant": false, "payable": false, "type": "function", "gas": 110291 }, { "name": "withdraw", "outputs": [], "inputs": [{ "type": "uint256", "name": "amount", "unit": "wei" }], "constant": false, "payable": false, "type": "function", "gas": 108330 }, { "name": "decimals", "outputs": [{ "type": "uint256", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 783 }, { "name": "symbol", "outputs": [{ "type": "string", "name": "out" }], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 2291 }];
