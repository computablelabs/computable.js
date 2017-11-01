"""
Tests for data mining. 
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import unittest
import datamined as dm


class TestMining(unittest.TestCase):
  """
  Test basic mining example. 
  """
  def test_basic_mining(self):
    data = "ATTAGGACATTTATA"

    # Create a data validator.
    validator = dm.valid.NaiveGenomicValidator()
    # Check whether data is valid
    assert validator.is_valid(data)

    # Create an introductory wallet 
    wallet = dm.coins.ExampleWallet()
    assert wallet.get_balance() == 0

    # Now that we know that the validator vouches for the data, we
    # store on the client. The act of storing generates coins.
    client = dm.data.InsecureFileClient("ignored", wallet)
    ledger = client.store(data, validator)
    assert client.get_wallet().get_balance() > 0

