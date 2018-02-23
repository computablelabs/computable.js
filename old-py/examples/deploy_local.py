# Note that before running this script, you must have initialized
# your local geth node. To do so, run
# datacoin/chains/local/run_chain.sh.

from populus import Project
from populus.utils.wait import wait_for_transaction_receipt
from web3 import RPCProvider
from web3 import Web3


def check_succesful_tx(web3, txid, timeout=180):
  # http://ethereum.stackexchange.com/q/6007/620
  print("Checking if transaction successful")
  receipt = wait_for_transaction_receipt(web3, txid, timeout=timeout)
  txinfo = web3.eth.getTransaction(txid)

  # EVM has only one error mode and it's consume all gas
  assert txinfo["gas"] != receipt["gasUsed"]
  print("txinfo['gas']: ", txinfo["gas"])
  print("receipt['gasUsed']: ", receipt["gasUsed"])
  return receipt


chain_name = "local"
project = Project("/home/rbharath/datamined/datacoin/")
with project.get_chain(chain_name) as chain:
  print(chain.config.keys())
  print(chain.config.get_config("contracts"))
  print(chain.config.get_config("contracts.backends"))
  print("########################################################")
  print(chain.contract_backend_configs.items())
  print("########################################################")
  print(chain.contract_backends.items())
  print("########################################################")
  print(chain.provider_backends.items())
  print("########################################################")
  print(chain.provider)
  print("########################################################")
  Crowdsale = chain.provider.get_contract_factory("Crowdsale")
  print(Crowdsale)
  print("########################################################")
  Token = chain.provider.get_contract_factory("EdgelessToken")
  print(Token)
  print("########################################################")
  web3 = chain.web3
  beneficiary = web3.eth.coinbase
  print("beneficiary is: ", beneficiary)
  print("########################################################")
  # Random address on Ropsten testnet
  multisig_address = "0x83917f644df1319a6ae792bb244333332e65fff8"
  txhash = Crowdsale.deploy(
      transaction={"from": beneficiary},
      args=[beneficiary, multisig_address, 1])
  print("Deploying crowdsale, tx hash is", txhash)
  receipt = check_succesful_tx(web3, txhash)
  crowdsale_address = receipt["contractAddress"]
  print("Crowdsale contract address is ", crowdsale_address)
  print("########################################################")
  txhash = Token.deploy(transaction={"from": beneficiary}, args=[beneficiary])
  print("Deploying token, tx hash is", txhash)
  receipt = check_succesful_tx(web3, txhash)
  token_address = receipt["contractAddress"]
  print("Token contract address is ", token_address)
  print("########################################################")
  print("Initializing contracts")
  crowdsale = Crowdsale(address=crowdsale_address)
  token = Token(address=token_address)
  txhash = crowdsale.transact({"from": beneficiary}).setToken(token_address)
  check_succesful_tx(web3, txhash)
  print("Doing some contract reads to check everything looks good")
  print("Token total supply is", token.call().totalSupply())
  print("Crowdsale max goal is", crowdsale.call().maxGoal())
