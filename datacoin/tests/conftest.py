"""Test fixtures."""

import pytest
from web3.contract import Contract


# http://stackoverflow.com/q/28898919/315168
def pytest_itemcollected(item):
  par = item.parent.obj
  node = item.obj
  pref = par.__doc__.strip() if par.__doc__ else par.__class__.__name__
  suf = node.__doc__.strip() if node.__doc__ else node.__name__
  if pref or suf:
    item._nodeid = ' '.join((pref, suf))
    item._nodeid.rstrip(".")


@pytest.fixture
def crowdsale(chain, beneficiary, multisig):
  """Create crowdsale contract."""
  args = [beneficiary, multisig, 0]
  contract, _ = chain.provider.get_or_deploy_contract(
      'Crowdsale', deploy_args=args)
  return contract


@pytest.fixture
def token(chain, crowdsale, beneficiary):
  """Create ICO contract."""
  #owner = crowdsale.address
  args = [beneficiary]  # Owner set
  contract, _ = chain.provider.get_or_deploy_contract(
      'EdgelessToken', deploy_args=args)
  assert crowdsale.call().tokenReward(
  ) == '0x0000000000000000000000000000000000000000'
  crowdsale.transact({"from": beneficiary}).setToken(contract.address)
  assert crowdsale.call().tokenReward(
  ) != '0x0000000000000000000000000000000000000000'

  # Allow crowdsale contract to issue out tokens All (500.000.000)
  # tokens initially belong to the edgeless team. Before ICO starts,
  # the Edgeless Team approves the ICO contract to spend up to
  # 440.000.000 tokens. Remaining tokens get burned as soon as the
  # ICO is closed. There will be 60.000.000 tokens left for the
  # edgeless team to hold and for the bounty program to be paid
  # (10.000.000).
  contract.transact({"from": beneficiary}).approve(crowdsale.address, 440000000)

  return contract


@pytest.fixture
def customer(accounts):
  """Get a customer address."""
  return accounts[1]


@pytest.fixture
def customer_2(accounts):
  """Get another customer address."""
  return accounts[2]


@pytest.fixture
def beneficiary(accounts):
  """The team control address."""
  return accounts[3]


@pytest.fixture
def multisig(accounts):
  """The team multisig address."""
  return accounts[4]


@pytest.fixture
def start():
  """Match in TestableCrowdsale."""
  return 1488294000


@pytest.fixture
def end():
  """Match in TestableCrowdsale."""
  return 1490112000


@pytest.fixture
def open_crowdsale(crowdsale, token, start):
  """We live in time when crowdsale is open"""
  crowdsale.transact().setCurrent(start + 1)
  token.transact().setCurrent(start + 1)
  return crowdsale


@pytest.fixture
def early_crowdsale(crowdsale, token, start):
  """We live in time when crowdsale is not yet open"""
  crowdsale.transact().setCurrent(start - 1)
  token.transact().setCurrent(start - 1)
  return crowdsale


@pytest.fixture
def finished_crowdsale(crowdsale, token, end):
  """We live in time when crowdsale is done."""
  crowdsale.transact().setCurrent(end + 1)
  token.transact().setCurrent(end + 1)
  return crowdsale


#
# ERC-20 fixtures
#


@pytest.fixture
def token_owner(beneficiary):
  return beneficiary


@pytest.fixture
def erc20_token(token, end):
  """Token behaves like ERC-20 after the crowdsale is over and liquidation limitation is lifted."""
  token.transact().setCurrent(end + 1)
  return token


@pytest.fixture
def empty_address(accounts):
  """Address without token balance."""
  return accounts[4]


@pytest.fixture
def allowed_party(accounts):
  """Gets ERC-20 allowance."""
  return accounts[5]
