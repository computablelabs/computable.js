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
import { stringToBytes, increaseTime } from '../../spec/helpers'
import { ParameterDefaults, NAME } from '../constants'

// gather deploy info
let mnemonic = '', account = '', infuraToken = ''

//if (fs.existsSync('secrets.json')) {
//  const secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))
//  mnemonic = secrets.mnemonic
 // account = secrets.account
 // infuraToken = secrets.infuraAccessToken
//} else {
//  console.log('No secrets.json file found in your project')
//}

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

// we can use the http provider for deployment..
mnemonic = "frog tattoo suffer copper evoke suggest fancy bag hire sport trophy orient"
provider = new HDWalletProvider(mnemonic, "http://localhost:8545")
web3 = new Web3(provider)
account = "0x179fdbcbd58a7edf3b130625d542936df4390d5f"




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

   var apply_event = registry.getEventEmitter("_Application")
    apply_event.on("data", function(res){
    console.log(res)
    })  

registry._
    await token.approve(votingAddress, 1000000)
    await token.approve(registryAddress, 1000000)

   
    //apply_event.watch(function(error, result){
    //if (!error)
    //  console.log(result);
    //});
    //console.log(apply_event)
    // 1st account needs funding
    await token.transfer(account, 500000)
    await token.approve(registryAddress, 250000, { from: account })
    await token.approve(parameterizerAddress, 250000, { from: account })

    console.log(registry).watch(function(error, event1) {
      console.log("event triggered", event1)
       Reload when a new vote is recorded
    })

    const listBytes = stringToBytes(web3, 'listing.com'),
      tx1 = await registry.apply(listBytes, ParameterDefaults.MIN_DEPOSIT)
    //console.log(tx1)
    const listing = await registry.listings(listBytes)
    console.log(listing)
    //const length = await parameterizer.get("applyStageLen")
    //console.log(length)
    return(1)
    

    //await increaseTime(provider, ParameterDefaults.APPLY_STAGE_LENGTH + 1)
    //const tx2 = await registry.updateStatus(listBytes)
  // TODO should prob have node process exit here rather than mash ^C

}






const fetch_listing_status = async () => {
  const listBytes2 = stringToBytes(web3, 'listing2.com'),
  tx2 = await registry.apply(listBytes2, ParameterDefaults.MIN_DEPOSIT)

  const listBytes = stringToBytes(web3, 'listing.com')
  await registry.updateStatus(listBytes)
  const listing1 = await registry.listings(listBytes)
  console.log(listing1)


  }

deploy().then(v => {setTimeout(function(){ 
  console.log("Waiting..");  
  fetch_listing_status();



}, 6000);}) 










