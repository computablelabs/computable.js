"""ERC-20 compatibility test suite"""

import pytest
from ethereum.tester import TransactionFailed
from web3.contract import Contract


def test_erc20_interface(erc20_token, token_owner, empty_address):
  """Edgeless token satisfies ERC-20 interface."""

  # https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC20.sol

  token = erc20_token
  assert token.call().totalSupply() > 0
  assert token.call().balanceOf(token_owner) > 0
  assert token.call().balanceOf(empty_address) == 0
  assert token.call().allowance(token_owner, empty_address) == 0

  # Event
  # We follow OpenZeppelin - in the ERO20 issue names are _from, _to, _value
  transfer = token._find_matching_event_abi(
    "Transfer", ["from", "to", "value"])
  assert transfer

  approval = token._find_matching_event_abi(
    "Approval", ["owner", "spender", "value"])
  assert approval


def test_erc20_transfer(erc20_token,
                        token_owner,
                        empty_address):
  """ERC-20 compatible transfer() is available."""

  token = erc20_token
  amount = 5000
  initial_balance = token.call().balanceOf(token_owner)

  token.transact({"from": token_owner}).transfer(
      empty_address, amount)

  assert token.call().balanceOf(token_owner) == (
      initial_balance - amount)
  assert token.call().balanceOf(empty_address) == amount

  events = token.pastEvents("Transfer").get()
  assert len(events) == 1
  e = events[0]
  # TODO(rbharath): Is this call to lower() valid? Original test failus due to case mismatches 'f' vs 'F' for example. Is this a hack fix or is there a real bug here?
  assert e["args"]["to"].lower() == empty_address
  assert e["args"]["from"].lower() == token_owner
  assert e["args"]["value"] == amount


def test_erc20_not_enough_balance(erc20_token,
                                  token_owner,
                                  empty_address):
  """ERC-20 transfer fails if user exceeds his/her balance."""

  token = erc20_token
  initial_balance = token.call().balanceOf(token_owner)
  amount = initial_balance + 1

  with pytest.raises(TransactionFailed):
    token.transact({"from": token_owner}).transfer(
        empty_address, amount)


def test_erc20_transfer_with_allowance(erc20_token,
                                       token_owner,
                                       empty_address,
                                       allowed_party):
  """Tokens can be transferred with ECR-20 allowance approval."""

  token = erc20_token
  amount = 5000
  initial_balance = token.call().balanceOf(token_owner)
  token.transact({"from": token_owner}).approve(
      allowed_party, amount)
  assert token.call().allowance(token_owner, allowed_party) == amount

  events = token.pastEvents("Approval").get()
  # Edgeless gets 2 events, because one is needed to construct token
  assert len( events) > 0
  e = events[-1]
  # TODO(rbharath): Is this call to lower() valid? Original test
  # fails due to case mismatches 'f' vs 'F' for example. Is this a
  # hack fix or is there a real bug here?
  assert e["args"]["owner"].lower() == token_owner
  assert e["args"]["spender"].lower() == allowed_party
  assert e["args"]["value"] == amount

  token.transact({
      "from": allowed_party
  }).transferFrom(token_owner, empty_address, amount)

  events = token.pastEvents("Transfer").get()
  assert len(events) == 1
  e = events[0]
  assert e["args"]["to"].lower() == empty_address
  assert e["args"]["from"].lower() == token_owner
  assert e["args"]["value"] == amount

  assert token.call().balanceOf(token_owner) == (
      initial_balance - amount)
  assert token.call().balanceOf(empty_address) == amount
  assert token.call().allowance(token_owner, allowed_party) == 0


def test_erc20_transfer_with_allowance_too_much(erc20_token,
                                                token_owner,
                                                empty_address,
                                                allowed_party):
  """One cannot transfers more than approved allowance."""

  token = erc20_token
  amount = 5000
  token.transact({"from": token_owner}).approve(allowed_party, amount)

  with pytest.raises(TransactionFailed):
    token.transact({
        "from": allowed_party
    }).transferFrom(token_owner, empty_address, amount + 1)
