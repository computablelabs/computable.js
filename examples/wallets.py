import datamined as dm

data = "ATTAGGACATTTATA"
private_key = "*&^#*HWEF(#@*R#(@JF"

# Create an introductory client wallet 
client_wallet = dm.coins.LocalGethWallet()

# TODO(rbharath): The wallet currently retains memory on the chain.
# This isn't desirable. Is there a good way to make sure a new wallet
# is made each time? The following code executes cleanup.
current_balance = client_wallet.get_balance()
client_wallet.withdraw(current_balance)

print("client_wallet.get_balance()", client_wallet.get_balance())
assert client_wallet.get_balance() == 0

# Deposit into wallet
client_wallet.deposit(10)
print("client_wallet.get_balance()", client_wallet.get_balance())
assert client_wallet.get_balance() == 10

# Withdraw from wallet
client_wallet.withdraw(7)
print("client_wallet.get_balance()", client_wallet.get_balance())
assert client_wallet.get_balance() == 3
