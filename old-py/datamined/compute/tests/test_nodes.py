"""
Tests for dataset compute. 
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import unittest
import datamined as dm


class TestComputation(unittest.TestCase):
  """
  Test basic computation example. 
  """

  def test_basic_computation_naive(self):
    data = "AAATT"
    wallet = dm.coins.ExampleWallet()
    validator = dm.valid.NaiveGenomicValidator()
    client = dm.data.InsecureFileClient("ignored", wallet)
    ledger = client.store(data, validator)
    ledger_key = client.get_ledger_key(ledger)

    node = dm.compute.GenomicCountInsecureFileNode(wallet)
    results = node.compute(ledger, ledger_key, "count-basepairs")
    assert results == {"A": 3, "T": 2, "C": 0, "G": 0}

  def test_gets_paid_naive(self):
    data = "ATTAGGACATTTATA"

    # Create a data validator.
    validator = dm.valid.NaiveGenomicValidator()
    # Create an introductory client wallet
    client_wallet = dm.coins.ExampleWallet()

    client = dm.data.InsecureFileClient("ignored", client_wallet)
    ledger = client.store(data, validator)
    ledger_key = client.get_ledger_key(ledger)

    # Create an introductory node wallet
    node_wallet = dm.coins.ExampleWallet()
    node = dm.compute.GenomicCountInsecureFileNode(node_wallet)
    results = node.compute(ledger, ledger_key, "count-basepairs")
    # The node should have been paid for this computation
    assert node.get_wallet().get_balance() > 0

    assert results == {"A": 6, "T": 6, "G": 2, "C": 1}
