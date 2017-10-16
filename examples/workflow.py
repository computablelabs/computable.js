# Provides a simple walkthrough of how to use the datamined API to allow two
# users to store data securely. Then demonstrates how data can be retrieved
# from secure storage. Note this example does not demonstrate any of the
# differential privacy features.

import datamined as dm

user_one_data = "ATTAGGACATTTATA"
user_two_data = "GATTAACCAATTAGAGA"

# Yes this is terrible. 
# TODO(rbharath): Swap out for non-demo code.
user_one_private_key = "*&^#*HWEF(#@*R#(@JF"
user_two_private_key = ")(*#$)(*#)@#(&(@#JJLk"

user_one_client = dm.data.Client(user_one_private_key)
user_two_client = dm.data.Client(user_two_private_key)


# The data_ledger objects contain records of where the data is stored.
# Accessing data stored at location pointed to by a particular ledger requires
# the associated private key.
# TODO(rbharath): Storing should return payment in datacoins. What is the API for doing so? 
user_one_data_ledger = user_one_client.store(user_one_data)
user_two_data_ledger = user_two_client.store(user_two_data)

user_one_retrieved_data = user_one_client.retrieve(user_one_data_ledger)
user_two_retrieved_data = user_two_client.retrieve(user_two_data_ledger)

assert user_one_data == user_one_retrieved_data
assert user_two_data == user_one_retrieved_data
