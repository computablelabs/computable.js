# Provides a simple example of how to perform computation with the datamined API. Data is stored using dm.data.Client objects. Them dm.compute.Node instances perform a basic computation upon the data from the corresponding nodes.

import datamined as dm

data = "ATTAGGACATTTATA"

private_key = "*&^#*HWEF(#@*R#(@JF"
client = dm.data.InsecureFileClient(private_key)
ledger = client.store(data)
# Assumes that dm.data.Client objects have the ability to generate
# "ledger_access_key"s which provide access to the data stored at the ledger
# location.
#TODO(rbharath): What is the right cryptographic primitive to
# perform this? Obviously, using the private key would allow for this, but
# that's a non-starter. Is there some elliptic curve operation to create
# partial access keys that can (ideally) be revoked?
ledger_key = client.get_ledger_key(ledger)

node = dm.compute.GenomicCountInsecureFileNode()
# It's still an open question how a Node can perform arbitrary computations. In
# this very early stage, going to punt and assume nodes can only perform a
# limited set of computations linked to by keywords.
results = node.compute(ledger, ledger_key, "count-basepairs")

assert results == {"A": 6, "T": 6, "G": 2, "C": 1}
