"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("./address");
const general_1 = require("./general");
exports.Token = {
    address: '0x337cDDa6D41A327c5ad456166CCB781a9722AFf9',
    decimals: 2,
    name: 'ComputableCoin',
    symbol: 'CC',
    supply: 5000000,
};
const holderOne = {
    address: address_1.Addresses.ONE,
    amount: general_1.ONE_THOUSAND,
};
const holderTwo = {
    address: address_1.Addresses.TWO,
    amount: general_1.ONE_THOUSAND,
};
const holderThree = {
    address: address_1.Addresses.THREE,
    amount: general_1.ONE_THOUSAND,
};
const holderFour = {
    address: address_1.Addresses.FOUR,
    amount: general_1.ONE_THOUSAND,
};
exports.TokenHolders = [holderOne, holderTwo, holderThree, holderFour];
//# sourceMappingURL=token.js.map