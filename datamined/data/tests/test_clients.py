"""
Tests for dataset creation
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import unittest
import datamined as dm


class TestInsecureFileClient(unittest.TestCase):
  """
  Test insecure file client.
  """
  def test_retrieval_naive(self):
    data = "AAATT"
    wallet = dm.coins.ExampleWallet()
    validator = dm.valid.NaiveGenomicValidator()
    client = dm.data.InsecureFileClient("ignored", wallet)
    ledger = client.store(data, validator)
    retrieved_data = client.retrieve(ledger)
    assert data == retrieved_data

  def test_multiple_user_naive(self):
    user_one_data = "ATTAGGACATTTATA"
    user_two_data = "GATTAACCAATTAGAGA"

    validator = dm.valid.NaiveGenomicValidator()

    # Create an introductory client wallet 
    user_one_wallet = dm.coins.ExampleWallet()
    user_one = dm.data.InsecureFileClient("ignored", user_one_wallet)
    assert user_one.get_wallet().get_balance() == 0

    user_two_wallet = dm.coins.ExampleWallet()
    user_two = dm.data.InsecureFileClient("ignored", user_two_wallet)
    assert user_two.get_wallet().get_balance() == 0

    user_one_data_ledger = user_one.store(user_one_data, validator)
    assert user_one.get_wallet().get_balance() > 0

    user_two_data_ledger = user_two.store(user_two_data, validator)
    assert user_two.get_wallet().get_balance() > 0

    user_one_retrieved_data = user_one.retrieve(user_one_data_ledger)
    user_two_retrieved_data = user_two.retrieve(user_two_data_ledger)

    assert user_one_data == user_one_retrieved_data
    assert user_two_data == user_two_retrieved_data
