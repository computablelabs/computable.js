"""
Tests for economy construction. 
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import warnings
warnings.filterwarnings('ignore', category=DeprecationWarning)
import unittest
import numpy as np
import datamined as dm


class TestEconomy(unittest.TestCase):
  """
  Test economy construction example. 
  """

  def test_simple_example_economy(self):
    N_miners = 10
    N_compute_nodes = 3
    N_buyers = 5
    N_operations = 100

    # In this economy, there is only one central validator
    validator = dm.valid.NaiveGenomicValidator()

    # Let's create some currency in this economy by mining some data
    # to create tokens.
    miners = []
    ledgers = []
    for n in range(N_miners):
      # Create an introductory client wallet
      miner_wallet = dm.coins.ExampleWallet()
      miner = dm.data.InsecureFileClient("ignored", miner_wallet)

      data = "ATTAGGACATTTATA"
      ledger = miner.store(data, validator)
      assert miner.get_wallet().get_balance() > 0
      miners.append(miner)
      ledgers.append(ledger)

    # At this point, there's currency floating around. This currency
    # should incentivize the entrace of computational nodes onto the
    # economy.
    compute_nodes = []
    for m in range(N_compute_nodes):
      # Create a node wallet
      node_wallet = dm.coins.ExampleWallet()
      assert node_wallet.get_balance() == 0

      node = dm.compute.GenomicCountInsecureFileNode(node_wallet)
      # Nodes start with no money.
      assert node.get_wallet().get_balance() == 0
      compute_nodes.append(node)

    buyers = miners[:N_buyers]
    # The buyers are now starting to compute things...
    for op in range(N_operations):
      # Select a random compute node
      node = compute_nodes[np.random.randint(0, N_compute_nodes)]
      # Select a random data node
      data = miners[np.random.randint(0, N_miners)]
      ledger = ledgers[np.random.randint(0, N_miners)]
      # Obtain ledger key
      ledger_key = data.get_ledger_key(ledger)

      # Nodes earn tokens when they perform computations.
      initial_node_tokens = node.get_wallet().get_balance()
      _ = node.compute(ledger, ledger_key, "count_basepairs")
      final_node_tokens = node.get_wallet().get_balance()
      assert final_node_tokens > initial_node_tokens

  def test_simple_blockchain_economy(self):
    """Create a simple economy, but using blockchain"""
    N_miners = 10
    N_compute_nodes = 3
    N_buyers = 5
    N_operations = 100

    # In this economy, there is only one central validator
    validator = dm.valid.NaiveGenomicValidator()

    # Let's create some currency in this economy by mining some data
    # to create tokens.
    miners = []
    ledgers = []
    for n in range(N_miners):
      # Create an introductory client wallet
      miner_wallet = dm.coins.LocalGethWallet()
      miner = dm.data.InsecureFileClient("ignored", miner_wallet)

      data = "ATTAGGACATTTATA"
      ledger = miner.store(data, validator)
      assert miner.get_wallet().get_balance() > 0
      miners.append(miner)
      ledgers.append(ledger)

    # At this point, there's currency floating around. This currency
    # should incentivize the entrace of computational nodes onto the
    # economy.
    compute_nodes = []
    for m in range(N_compute_nodes):
      # Create a node wallet
      node_wallet = dm.coins.LocalGethWallet()
      assert node_wallet.get_balance() == 0

      node = dm.compute.GenomicCountInsecureFileNode(node_wallet)
      # Nodes start with no money.
      assert node.get_wallet().get_balance() == 0
      compute_nodes.append(node)

    buyers = miners[:N_buyers]
    # The buyers are now starting to compute things...
    for op in range(N_operations):
      # Select a random compute node
      node = compute_nodes[np.random.randint(0, N_compute_nodes)]
      # Select a random data node
      data = miners[np.random.randint(0, N_miners)]
      ledger = ledgers[np.random.randint(0, N_miners)]
      # Obtain ledger key
      ledger_key = data.get_ledger_key(ledger)

      # Nodes earn tokens when they perform computations.
      initial_node_tokens = node.get_wallet().get_balance()
      _ = node.compute(ledger, ledger_key, "count_basepairs")
      final_node_tokens = node.get_wallet().get_balance()
      assert final_node_tokens > initial_node_tokens
