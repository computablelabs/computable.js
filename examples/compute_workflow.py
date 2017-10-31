# Provides a simple example of how to perform computation with the
# datamined API. Data is stored using dm.data.Client objects. Them
# dm.compute.Node instances perform a basic computation upon the data
# from the corresponding nodes.

import datamined as dm

data = "ATTAGGACATTTATA"
private_key = "*&^#*HWEF(#@*R#(@JF"

# Create a data validator.
validator = dm.valid.NaiveGenomicValidator()
# Check whether data is valid
assert validator.is_valid(data)

# Create an introductory client wallet 
client_wallet = dm.coins.ExampleWallet()
assert client_wallet.get_balance() == 0

client = dm.data.InsecureFileClient(private_key, client_wallet)
assert client.get_wallet().get_balance() == 0
ledger = client.store(data, validator)

# Assumes that dm.data.Client objects have the ability to generate
# "ledger_access_key"s which provide access to the data stored at the ledger
# location.
#TODO(rbharath): What is the right cryptographic primitive to
# perform this? Obviously, using the private key would allow for this, but
# that's a non-starter. Is there some elliptic curve operation to create
# partial access keys that can (ideally) be revoked?
ledger_key = client.get_ledger_key(ledger)

# Create an introductory node wallet 
node_wallet = dm.coins.ExampleWallet()
assert node_wallet.get_balance() == 0

node = dm.compute.GenomicCountInsecureFileNode(node_wallet)
# It's still an open question how a Node can perform arbitrary computations. In
# this very early stage, going to punt and assume nodes can only perform a
# limited set of computations linked to by keywords.
results = node.compute(ledger, ledger_key, "count-basepairs")
# The node should have been paid for this computation
assert node.get_wallet().get_balance() > 0

assert results == {"A": 6, "T": 6, "G": 2, "C": 1}
