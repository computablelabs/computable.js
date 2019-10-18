"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPLICATION = 1;
exports.CHALLENGE = 2;
exports.LISTING_ABI = [{ "name": "ApplicationFailed", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }, { "type": "address", "name": "applicant", "indexed": true }], "anonymous": false, "type": "event" }, { "name": "Applied", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }, { "type": "address", "name": "applicant", "indexed": true }], "anonymous": false, "type": "event" }, { "name": "AccessRewardClaimed", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }, { "type": "uint256", "name": "maker_fee", "indexed": false, "unit": "wei" }, { "type": "uint256", "name": "minted", "indexed": false }], "anonymous": false, "type": "event" }, { "name": "Challenged", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }, { "type": "address", "name": "challenger", "indexed": true }], "anonymous": false, "type": "event" }, { "name": "ChallengeFailed", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }, { "type": "address", "name": "challenger", "indexed": true }], "anonymous": false, "type": "event" }, { "name": "ChallengeSucceeded", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }, { "type": "address", "name": "challenger", "indexed": true }], "anonymous": false, "type": "event" }, { "name": "Listed", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }, { "type": "address", "name": "owner", "indexed": true }, { "type": "uint256", "name": "reward", "indexed": false, "unit": "wei" }], "anonymous": false, "type": "event" }, { "name": "ListingRemoved", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }], "anonymous": false, "type": "event" }, { "name": "WithdrawnFromListing", "inputs": [{ "type": "bytes32", "name": "hash", "indexed": true }, { "type": "address", "name": "owner", "indexed": true }, { "type": "uint256", "name": "withdrawn", "indexed": false, "unit": "wei" }], "anonymous": false, "type": "event" }, { "outputs": [], "inputs": [{ "type": "address", "name": "market_token_addr" }, { "type": "address", "name": "voting_addr" }, { "type": "address", "name": "p11r_addr" }, { "type": "address", "name": "res_addr" }, { "type": "address", "name": "data_addr" }], "constant": false, "payable": false, "type": "constructor" }, { "name": "isListed", "outputs": [{ "type": "bool", "name": "out" }], "inputs": [{ "type": "bytes32", "name": "hash" }], "constant": true, "payable": false, "type": "function", "gas": 747 }, { "name": "withdrawFromListing", "outputs": [], "inputs": [{ "type": "bytes32", "name": "hash" }, { "type": "uint256", "unit": "wei", "name": "amount" }], "constant": false, "payable": false, "type": "function", "gas": 41054 }, { "name": "list", "outputs": [], "inputs": [{ "type": "bytes32", "name": "hash" }], "constant": false, "payable": false, "type": "function", "gas": 10000 }, { "name": "getListing", "outputs": [{ "type": "address", "name": "out" }, { "type": "uint256", "unit": "wei", "name": "out" }], "inputs": [{ "type": "bytes32", "name": "hash" }], "constant": true, "payable": false, "type": "function", "gas": 1299 }, { "name": "resolveApplication", "outputs": [], "inputs": [{ "type": "bytes32", "name": "hash" }], "constant": false, "payable": false, "type": "function", "gas": 90063 }, { "name": "claimAccessReward", "outputs": [], "inputs": [{ "type": "bytes32", "name": "hash" }], "constant": false, "payable": false, "type": "function", "gas": 47866 }, { "name": "challenge", "outputs": [], "inputs": [{ "type": "bytes32", "name": "hash" }], "constant": false, "payable": false, "type": "function", "gas": 10153 }, { "name": "resolveChallenge", "outputs": [], "inputs": [{ "type": "bytes32", "name": "hash" }], "constant": false, "payable": false, "type": "function", "gas": 61132 }, { "name": "exit", "outputs": [], "inputs": [{ "type": "bytes32", "name": "hash" }], "constant": false, "payable": false, "type": "function", "gas": 50589 }];
