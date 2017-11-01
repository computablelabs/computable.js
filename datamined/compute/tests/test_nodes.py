"""
Tests for dataset compute. 
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
  data = "AAATT"
  wallet = dm.coins.ExampleWallet()
  validator = dm.valid.NaiveGenomicValidator()
  client = dm.data.InsecureFileClient("ignored", wallet)
  ledger = client.store(data, validator)
  ledger_key = client.get_ledger_key(ledger)

  node = dm.compute.GenomicCountInsecureFileNode(wallet)
  results = node.compute(ledger, ledger_key, "count-basepairs")
  assert results == {"A": 3, "T": 2, "C": 0, "G": 0}
