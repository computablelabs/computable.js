import fs from 'fs'
import Web3 from 'web3'
import { Contract } from 'web3/types.d'
import HDWalletProvider from 'truffle-hdwallet-provider'
import {
  TEST_NET_GAS,
  TEST_NET_GAS_PRICE,
} from '../constants'
import Erc20 from '../contracts/erc-20'
import Voting from '../contracts/plcr-voting'
import Parameterizer from '../contracts/parameterizer'
import Registry from '../contracts/registry'
import { deployDll, deployAttributeStore } from '../helpers'

// gather deploy info
let mnemonic = '', account = '', infuraToken = ''

if (fs.existsSync('secrets.json')) {
  const secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))
  mnemonic = secrets.mnemonic
  account = secrets.account
  infuraToken = secrets.infuraAccessToken
} else {
  console.log('No secrets.json file found in your project')
}

// get the HOCs ready
let web3:Web3,
  provider:any,
  token:Erc20,
  tokenAddress:string,
  dll:Contract,
  dllAddress:string,
  store:Contract,
  attributeStoreAddress:string,
  voting:Voting,
  votingAddress:string,
  parameterizer:Parameterizer,
  parameterizerAddress:string,
  registry:Registry,
  registryAddress:string

// we can use the http provider for deployment...
provider = new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraToken}`)
web3 = new Web3(provider)

const deploy = async () => {
  token = new Erc20(account)
  // supply as 2 ETH converted to wei
  tokenAddress = await token.deploy(web3, { address: account, supply: 2000000000000000000 }, { gas: TEST_NET_GAS, gasPrice: TEST_NET_GAS_PRICE })
  console.log(`TOKEN ADDRESS: ${tokenAddress}`)

  dll = await deployDll(web3, account)
  dllAddress = dll.options.address

  store = await deployAttributeStore(web3, account)
  attributeStoreAddress = store.options.address

  voting = new Voting(account)
  votingAddress = await voting.deploy(web3, { tokenAddress, dllAddress, attributeStoreAddress }, { gas: TEST_NET_GAS, gasPrice: TEST_NET_GAS_PRICE })
  console.log(`VOTING ADDRESS: ${votingAddress}`)

  parameterizer = new Parameterizer(account)
  // allow the p11r to fall back on defaults
  parameterizerAddress = await parameterizer.deploy(web3, { tokenAddress, votingAddress }, { gas: TEST_NET_GAS, gasPrice: TEST_NET_GAS_PRICE })
  console.log(`PARAMETERIZER ADDRESS: ${parameterizerAddress}`)

  registry = new Registry(account)
  registryAddress = await registry.deploy(web3, { tokenAddress, votingAddress, parameterizerAddress, name: 'Computable TCR v0.1.0' }, { gas: TEST_NET_GAS, gasPrice: TEST_NET_GAS_PRICE })
  console.log(`REGISTRY ADDRESS: ${registryAddress}`)

  // TODO should prob have node process exit here rather than mash ^C
}

deploy()
