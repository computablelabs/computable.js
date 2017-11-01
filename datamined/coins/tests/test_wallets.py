"""
Tests for wallet creation 
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import unittest
import datamined as dm


class TestWallets(unittest.TestCase):
  """
  Test basic computation example. 
  """

  def test_local_geth_wallet(self):
    data = "ATTAGGACATTTATA"
    private_key = "*&^#*HWEF(#@*R#(@JF"

    # Create an introductory client wallet
    client_wallet = dm.coins.LocalGethWallet()

    print("client_wallet.get_balance()", client_wallet.get_balance())
    assert client_wallet.get_balance() == 0

    # Deposit into wallet
    client_wallet.deposit(10)
    print("client_wallet.get_balance()", client_wallet.get_balance())
    assert client_wallet.get_balance() == 10

    # Withdraw from wallet
    client_wallet.withdraw(7)
    print("client_wallet.get_balance()", client_wallet.get_balance())
    assert client_wallet.get_balance() == 3
