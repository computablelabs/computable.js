"""
Tests for wallet creation 
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import unittest
import web3
import datamined as dm
from populus import Project
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
