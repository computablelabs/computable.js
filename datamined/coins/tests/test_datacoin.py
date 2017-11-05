"""
Tests for wallet creation 
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import unittest
import web3
import datetime
from web3 import Web3
import datamined as dm
from populus import Project
from ethereum import tester as t
from datamined.coins.wallets import DATACOIN_PATH


class TestDataCoin(unittest.TestCase):
  """
  Test API for DataCoins. 
  """

  def test_token_basic(self):
    """Does basic tests on crowdsale construction"""
    project_dir = DATACOIN_PATH
    project = Project(project_dir)
    chain_name = "tester"

    with project.get_chain(chain_name) as chain:
      # TODO(rbharath): These default accounts are set by populus
      # somewhere. Figure out how to configure this directly.
      # setup
      accounts = chain.web3.eth.accounts
      beneficiary = accounts[3]
      multisig = accounts[4]
      # crowdsale
      args = [beneficiary, multisig, 0]
      crowdsale, _ = chain.provider.get_or_deploy_contract(
          'Crowdsale', deploy_args=args)
      # Token contract address is not yet set.
      assert crowdsale.call().tokenReward(
      ) == '0x0000000000000000000000000000000000000000'

  def test_initialized(self):
    """Crowdsale is properly initialized with given parameters."""

    project_dir = DATACOIN_PATH
    project = Project(project_dir, create_config_file=True)
    with project.get_chain('tester') as chain:
      beneficiary = chain.web3.eth.accounts[3]
      multisig = chain.web3.eth.accounts[4]
      
      # Initialize crowdsale
      args = [beneficiary, multisig, 0]
      crowdsale, _ = chain.provider.get_or_deploy_contract(
          'Crowdsale', deploy_args=args)

      # Initialize token
      args = [beneficiary]  # Owner set
      token, _ = chain.provider.get_or_deploy_contract(
          'DataCoin', deploy_args=args)
      assert crowdsale.call().tokenReward(
      ) == '0x0000000000000000000000000000000000000000'
      crowdsale.transact({"from": beneficiary}).setToken(
          token.address)
      assert crowdsale.call().tokenReward(
      ) != '0x0000000000000000000000000000000000000000'

      token.transact({"from": beneficiary}).approve(
          crowdsale.address, 440000000)

      assert token.call().balanceOf(beneficiary) == 500000000
      assert token.call().totalSupply() == 500000000
      assert token.call().owner().lower() == beneficiary
      assert token.call().allowance(beneficiary, crowdsale.address) == 440000000
      assert token.call().owner().lower() == crowdsale.call().beneficiary().lower()

  def test_token_initialized(self):
    """Crowdsale is properly initialized with given parameters."""
    project_dir = DATACOIN_PATH
    project = Project(project_dir)
    chain_name = "tester"

    with project.get_chain(chain_name) as chain:
      # setup
      accounts = chain.web3.eth.accounts
      beneficiary = accounts[3]
      multisig = accounts[4]
      # crowdsale
      args = [beneficiary, multisig, 0]
      crowdsale, _ = chain.provider.get_or_deploy_contract(
          'Crowdsale', deploy_args=args)

      # token
      token, _ = chain.provider.get_or_deploy_contract(
          'DataCoin', deploy_args=[beneficiary])
      assert crowdsale.call().tokenReward(
      ) == '0x0000000000000000000000000000000000000000'
      # Assert that the crowdsale address is now set
      crowdsale.transact({"from": beneficiary}).setToken(token.address)
      assert crowdsale.call().tokenReward(
      ) != '0x0000000000000000000000000000000000000000'

      assert token.call().balanceOf(beneficiary) == 500000000
      assert token.call().totalSupply() == 500000000
      assert token.call().owner().lower() == beneficiary
      # TODO(rbharath): Figure out why these aren't running.
      #assert token.call().allowance(beneficiary, crowdsale.address) == 440000000
      #assert token.call().owner().lower() == crowdsale.call().beneficiary().lower()

    # TODO(rbharath): This is adapted directly from the example code. Doesn't make sense for DataMined, so remove in future PR.
    #def test_get_price_tiers(crowdsale, token, customer, web3):

  def test_get_price_tiers(self):
    """Price tiers match given dates."""
    project_dir = DATACOIN_PATH
    project = Project(project_dir)
    chain_name = "tester"

    with project.get_chain(chain_name) as chain:
      # setup
      accounts = chain.web3.eth.accounts
      customer = accounts[1]
      beneficiary = accounts[3]
      multisig = accounts[4]
      # crowdsale
      crowdsale, _ = chain.provider.get_or_deploy_contract(
          'Crowdsale', deploy_args=[beneficiary, multisig, 0])
      # token
      token, _ = chain.provider.get_or_deploy_contract(
          'DataCoin', deploy_args=[beneficiary])
      crowdsale.transact({"from": beneficiary}).setToken(token.address)

      deadlines = [1488297600, 1488902400, 1489507200, 1490112000]
      prices = [
          833333333333333, 909090909090909, 952380952380952, 1000000000000000
      ]

      for idx, deadline in enumerate(deadlines):
        crowdsale.transact().setCurrent(deadline - 1)
        assert crowdsale.call().getPrice() == prices[idx]

      # Post last deadline prcie
      crowdsale.transact().setCurrent(deadlines[-1] + 1)
      assert crowdsale.call().getPrice() == 1000000000000000

  def test_get_price_tiers_2(self):
    """Price tiers match given dates."""
    project_dir = DATACOIN_PATH
    project = Project(project_dir, create_config_file=True)
    with project.get_chain('tester') as chain:
      beneficiary = chain.web3.eth.accounts[3]
      multisig = chain.web3.eth.accounts[4]
      customer = chain.web3.eth.accounts[1]
      
      # Initialize crowdsale
      args = [beneficiary, multisig, 0]
      crowdsale, _ = chain.provider.get_or_deploy_contract(
          'Crowdsale', deploy_args=args)

      # Initialize token
      args = [beneficiary]  # Owner set
      token, _ = chain.provider.get_or_deploy_contract(
          'DataCoin', deploy_args=args)
      assert crowdsale.call().tokenReward(
      ) == '0x0000000000000000000000000000000000000000'
      crowdsale.transact({"from": beneficiary}).setToken(
          token.address)
      assert crowdsale.call().tokenReward(
      ) != '0x0000000000000000000000000000000000000000'

      token.transact({"from": beneficiary}).approve(
          crowdsale.address, 440000000)

      deadlines = [1488297600, 1488902400, 1489507200, 1490112000]
      prices = [833333333333333, 909090909090909, 952380952380952, 1000000000000000]

      for idx, deadline in enumerate(deadlines):
        crowdsale.transact().setCurrent(deadline - 1)
        assert crowdsale.call().getPrice() == prices[idx]

      # Post last deadline prcie
      crowdsale.transact().setCurrent(deadlines[-1] + 1)
      assert crowdsale.call().getPrice() == 1000000000000000

  def test_dates(self):
    """Dates match given in the project material."""
    project_dir = DATACOIN_PATH
    project = Project(project_dir, create_config_file=True)
    with project.get_chain('tester') as chain:
      beneficiary = chain.web3.eth.accounts[3]
      multisig = chain.web3.eth.accounts[4]
      customer = chain.web3.eth.accounts[1]
      
      # Initialize crowdsale
      args = [beneficiary, multisig, 0]
      crowdsale, _ = chain.provider.get_or_deploy_contract(
          'Crowdsale', deploy_args=args)

      # Initialize token
      args = [beneficiary]  # Owner set
      token, _ = chain.provider.get_or_deploy_contract(
          'DataCoin', deploy_args=args)
      assert crowdsale.call().tokenReward(
      ) == '0x0000000000000000000000000000000000000000'
      crowdsale.transact({"from": beneficiary}).setToken(
          token.address)
      assert crowdsale.call().tokenReward(
      ) != '0x0000000000000000000000000000000000000000'

      token.transact({"from": beneficiary}).approve(
          crowdsale.address, 440000000)

      deadlines = [
          crowdsale.call().deadlines(0),
          crowdsale.call().deadlines(1),
          crowdsale.call().deadlines(2),
          crowdsale.call().deadlines(3)
      ]

      print("Start is {}".format(
          datetime.datetime.fromtimestamp(
              crowdsale.call().start(), tz=datetime.timezone.utc)))

      for idx, deadline in enumerate(deadlines):
        print("Deadline {} is {}".format(idx,
                                        datetime.datetime.fromtimestamp(
                                            deadline, tz=datetime.timezone.utc)))

      print("Token is transferable {}".format(
          datetime.datetime.fromtimestamp(
              token.call().startTime(), tz=datetime.timezone.utc)))

      assert token.call().startTime() == deadlines[-1]

  def test_buy_tokens(self):
    """Sending ETH successfully buys tokens."""
    start = 1488294000
    end = 1490112000
    project_dir = DATACOIN_PATH
    project = Project(project_dir, create_config_file=True)
    with project.get_chain('tester') as chain:
      beneficiary = chain.web3.eth.accounts[3]
      multisig = chain.web3.eth.accounts[4]
      customer = chain.web3.eth.accounts[1]
      
      # Initialize crowdsale
      args = [beneficiary, multisig, 0]
      crowdsale, _ = chain.provider.get_or_deploy_contract(
          'Crowdsale', deploy_args=args)

      # Initialize token
      args = [beneficiary]  # Owner set
      token, _ = chain.provider.get_or_deploy_contract(
          'DataCoin', deploy_args=args)
      assert crowdsale.call().tokenReward(
      ) == '0x0000000000000000000000000000000000000000'
      crowdsale.transact({"from": beneficiary}).setToken(
          token.address)
      assert crowdsale.call().tokenReward(
      ) != '0x0000000000000000000000000000000000000000'

      token.transact({"from": beneficiary}).approve(
          crowdsale.address, 440000000)

      # Doing open crowdsale
      crowdsale.transact().setCurrent(start + 1)
      token.transact().setCurrent(start + 1)

      chain.web3.eth.sendTransaction({
          "from": customer,
          "to": crowdsale.address,
          "value": Web3.toWei(20, "ether"),
          "gas": 250000,
      })

      # We get ERC-20 event
      events = token.pastEvents("Transfer").get()
      assert len(events) == 1
      e = events[0]
      assert e["args"]["to"].lower() == customer
      assert e["args"]["from"].lower() == beneficiary
      assert e["args"]["value"] == 24000

      # We get crowdsale event
      events = crowdsale.pastEvents("FundTransfer").get()
      assert len(events) == 1
      e = events[0]
      assert e["args"]["backer"].lower() == customer
      assert e["args"]["amount"] == Web3.toWei(20, "ether")
      assert e["args"]["amountRaised"] == Web3.toWei(20, "ether")
