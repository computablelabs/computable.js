# computable
[![Build Status](https://travis-ci.org/computablelabs/computable.js.svg?branch=master)](https://travis-ci.org/computablelabs/computable.js)

## A Protocol for Making the World Computable
https://github.com/computablelabs/contracts contains the smart contract code for the Computable protocol. This repository maintains the user-facing client that interfaces with the protocol.

### Setup
* git clone...
* `npm install`
* `npm run test`

#### Note on the compiled contract files
If there is ever a need to manually update the compiled `abi` and `bin` files clone the [computable main repo]() as a sibling to this one
and use the package.json `update` scripts.

These files are not included in the Typescript build, as a browser environment can't make use of them. The `abi` interface for each contract
is stored as a constant, and used to instantiate each *Higher Order Contract* as well as to look up gas cost on demand. Bytecode files,
_.bin_, are only required for specs thus can be read utilizing the Node.js `readfile` based helper `readBytecode` (`.bin` files are not included
in the Typescript build)
