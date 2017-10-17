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
  data = "AAATT"
  client = dm.data.InsecureFileClient("ignored")
  ledger = client.store(data)
  retrieved_data = client.retrieve(ledger)
  assert data == retrieved_data
  

