# Provides an example of a dummy cryptoeconomy. This economy is created by a
# number of miners/users bringing on-board data onto the network. Miners are
# rewarded for their cryptoeconomic with coin issuances. Next, a number of
# compute nodes enter the economy. Note that compute nodes start with empty
# wallets. Sequentially, a number of buyers enter the market. Buyers select
# random users to interact with. If the user grants permission to the buyer,
# the buyer receives the ledger key, which it then uses to perform a
# computation.

import datamined as dm

N_miners = 10
N_compute_nodes = 3
N_buyers = 5
N_operations = 100

# In this economy, there is only one central validator
validator = dc.valid.NaiveGenomicsValidator()

# Let's create some currency in this economy by mining some data to create
# tokens.
miners = []
# TODO(rbharath): This ledger requirement is awkward. Should miners just have a
# list of their own ledgers?
ledgers = []
for n in range(N_miners):
  miner = dm.data.InsecureFileClient()
  assert miner.get_wallet().token_count() == 0

  # TODO(rbharath): Each miner should be entering in random data. Need to add a
  # decay term to the issuance regime so that repeatedly adding in the same
  # dataset shouldn't yield good results.
  data = "ATTAGGACATTTATA"
  ledger = miner.store(data, validator)
  assert miner.get_wallet().token_count() > 0
  miners.append(miner)
  ledgers.append(ledger)


# At this point, there's currency floating around. This currency should
# incentivize the entrace of computational nodes onto the economy.
compute_nodes = []
for m in range(N_compute_nodes):
  node = dm.compute.genomicCountInsecureFileNode()
  # Nodes start with no money.
  assert node.get_wallet().token_count() == 0
  compute_nodes.append(node)

# With both data and compute in the economy, buyers now enter the fray.
# Note that the only way to bring money into this economy is through data
# mining. As a result, all our buyers are in fact users! We specify that some
# fraction of our miners were in fact buyers entering the market.
buyers = miners[:N_buyers]
# The buyers are now starting to compute things...
for op in range(N_operations):
  # Select a random compute node
  node = compute_nodes[random.randint(0, N_compute_nodes)]
  # Select a random data node
  data = miners[random.randint(0, N_miners)]
  ledger = ledgers[random.randint(0, N_miners)]
  # Obtain ledger key
  ledger_key = data.get_ledger_key(ledger)

  # Nodes earn tokens when they perform computations.
  initial_node_tokens = node.get_wallet().token_count()
  _ = node.compute(ledger, ledger_key, "count_basepairs")
  final_node_tokens = node.get_wallet().token_count()
  assert final_node_tokens > initial_node_tokens

# TODO(rbharath): How does this economy steady state? Current model means that
# system will settle into some type of cyclical flux of capital. What are other
# long range outcomes?
