# This test file tests the Wallet contract


def test_deposit(chain):
  wallet, _ = chain.provider.get_or_deploy_contract("Wallet")

  # Make a deposit into the wallet
  deposit_txn_hash = wallet.transact().deposit(10)
  chain.wait.for_receipt(deposit_txn_hash)

  # Check that the value in the wallet is 10
  balance = wallet.call().getBalance()
  assert balance == 10


def test_withdraw(chain):
  wallet, _ = chain.provider.get_or_deploy_contract("Wallet")

  # Make a deposit into the wallet
  deposit_txn_hash = wallet.transact().deposit(10)
  chain.wait.for_receipt(deposit_txn_hash)

  # Check that the value in the wallet is 10
  balance = wallet.call().getBalance()
  assert balance == 10

  # Make a deposit into the wallet
  withdraw_txn_hash = wallet.transact().withdraw(10)
  chain.wait.for_receipt(withdraw_txn_hash)

  # Check that the value in the wallet is 10
  balance = wallet.call().getBalance()
  print("balance: ", balance)
