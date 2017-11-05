"""Crowdsale test suite."""
import datetime

import pytest
from ethereum.tester import TransactionFailed
from web3 import Web3
from web3.contract import Contract
from populus.project import Project
from datamined.coins.wallets import DATACOIN_PATH


def test_initialized():
  """Crowdsale is properly initialized with given parameters."""

  project_dir = DATACOIN_PATH
  project = Project(project_dir, create_config_file=True)
  with project.get_chain('tester') as chain:
    beneficiary = chain.web3.eth.accounts[3]
    multisig = chain.web3.eth.accounts[4]
    
    # Initialize crowdsale
    args = [beneficiary, multisig, 0]
    crowdsale, _ = chain.provider.get_or_deploy_contract(
        'Crowdsale', deploy_args=args)

    # Initialize token
    args = [beneficiary]  # Owner set
    token, _ = chain.provider.get_or_deploy_contract(
        'DataCoin', deploy_args=args)
    assert crowdsale.call().tokenReward(
    ) == '0x0000000000000000000000000000000000000000'
    crowdsale.transact({"from": beneficiary}).setToken(
        token.address)
    assert crowdsale.call().tokenReward(
    ) != '0x0000000000000000000000000000000000000000'

    token.transact({"from": beneficiary}).approve(
        crowdsale.address, 440000000)

    assert token.call().balanceOf(beneficiary) == 500000000
    assert token.call().totalSupply() == 500000000
    assert token.call().owner().lower() == beneficiary
    assert token.call().allowance(beneficiary, crowdsale.address) == 440000000
    assert token.call().owner().lower() == crowdsale.call().beneficiary().lower()


#def test_get_price_tiers(crowdsale, token, customer, web3):
def test_get_price_tiers():
  """Price tiers match given dates."""
  project_dir = DATACOIN_PATH
  project = Project(project_dir, create_config_file=True)
  with project.get_chain('tester') as chain:
    beneficiary = chain.web3.eth.accounts[3]
    multisig = chain.web3.eth.accounts[4]
    customer = chain.web3.eth.accounts[1]
    
    # Initialize crowdsale
    args = [beneficiary, multisig, 0]
    crowdsale, _ = chain.provider.get_or_deploy_contract(
        'Crowdsale', deploy_args=args)

    # Initialize token
    args = [beneficiary]  # Owner set
    token, _ = chain.provider.get_or_deploy_contract(
        'DataCoin', deploy_args=args)
    assert crowdsale.call().tokenReward(
    ) == '0x0000000000000000000000000000000000000000'
    crowdsale.transact({"from": beneficiary}).setToken(
        token.address)
    assert crowdsale.call().tokenReward(
    ) != '0x0000000000000000000000000000000000000000'

    token.transact({"from": beneficiary}).approve(
        crowdsale.address, 440000000)

    deadlines = [1488297600, 1488902400, 1489507200, 1490112000]
    prices = [833333333333333, 909090909090909, 952380952380952, 1000000000000000]

    for idx, deadline in enumerate(deadlines):
      crowdsale.transact().setCurrent(deadline - 1)
      assert crowdsale.call().getPrice() == prices[idx]

    # Post last deadline prcie
    crowdsale.transact().setCurrent(deadlines[-1] + 1)
    assert crowdsale.call().getPrice() == 1000000000000000


#def test_dates(crowdsale, token, customer, web3):
def test_dates():
  """Dates match given in the project material."""
  project_dir = DATACOIN_PATH
  project = Project(project_dir, create_config_file=True)
  with project.get_chain('tester') as chain:
    beneficiary = chain.web3.eth.accounts[3]
    multisig = chain.web3.eth.accounts[4]
    customer = chain.web3.eth.accounts[1]
    
    # Initialize crowdsale
    args = [beneficiary, multisig, 0]
    crowdsale, _ = chain.provider.get_or_deploy_contract(
        'Crowdsale', deploy_args=args)

    # Initialize token
    args = [beneficiary]  # Owner set
    token, _ = chain.provider.get_or_deploy_contract(
        'DataCoin', deploy_args=args)
    assert crowdsale.call().tokenReward(
    ) == '0x0000000000000000000000000000000000000000'
    crowdsale.transact({"from": beneficiary}).setToken(
        token.address)
    assert crowdsale.call().tokenReward(
    ) != '0x0000000000000000000000000000000000000000'

    token.transact({"from": beneficiary}).approve(
        crowdsale.address, 440000000)

    deadlines = [
        crowdsale.call().deadlines(0),
        crowdsale.call().deadlines(1),
        crowdsale.call().deadlines(2),
        crowdsale.call().deadlines(3)
    ]

    print("Start is {}".format(
        datetime.datetime.fromtimestamp(
            crowdsale.call().start(), tz=datetime.timezone.utc)))

    for idx, deadline in enumerate(deadlines):
      print("Deadline {} is {}".format(idx,
                                      datetime.datetime.fromtimestamp(
                                          deadline, tz=datetime.timezone.utc)))

    print("Token is transferable {}".format(
        datetime.datetime.fromtimestamp(
            token.call().startTime(), tz=datetime.timezone.utc)))

    assert token.call().startTime() == deadlines[-1]


#def test_buy_tokens(open_crowdsale, token, customer, beneficiary, web3):
def test_buy_tokens():
  """Sending ETH successfully buys tokens."""
  start = 1488294000
  end = 1490112000
  project_dir = DATACOIN_PATH
  project = Project(project_dir, create_config_file=True)
  with project.get_chain('tester') as chain:
    beneficiary = chain.web3.eth.accounts[3]
    multisig = chain.web3.eth.accounts[4]
    customer = chain.web3.eth.accounts[1]
    
    # Initialize crowdsale
    args = [beneficiary, multisig, 0]
    crowdsale, _ = chain.provider.get_or_deploy_contract(
        'Crowdsale', deploy_args=args)

    # Initialize token
    args = [beneficiary]  # Owner set
    token, _ = chain.provider.get_or_deploy_contract(
        'DataCoin', deploy_args=args)
    assert crowdsale.call().tokenReward(
    ) == '0x0000000000000000000000000000000000000000'
    crowdsale.transact({"from": beneficiary}).setToken(
        token.address)
    assert crowdsale.call().tokenReward(
    ) != '0x0000000000000000000000000000000000000000'

    token.transact({"from": beneficiary}).approve(
        crowdsale.address, 440000000)

    # Doing open crowdsale
    crowdsale.transact().setCurrent(start + 1)
    token.transact().setCurrent(start + 1)

    chain.web3.eth.sendTransaction({
        "from": customer,
        "to": crowdsale.address,
        "value": Web3.toWei(20, "ether"),
        "gas": 250000,
    })

    # We get ERC-20 event
    events = token.pastEvents("Transfer").get()
    assert len(events) == 1
    e = events[0]
    assert e["args"]["to"].lower() == customer
    assert e["args"]["from"].lower() == beneficiary
    assert e["args"]["value"] == 24000

    # We get crowdsale event
    events = crowdsale.pastEvents("FundTransfer").get()
    assert len(events) == 1
    e = events[0]
    assert e["args"]["backer"].lower() == customer
    assert e["args"]["amount"] == Web3.toWei(20, "ether")
    assert e["args"]["amountRaised"] == Web3.toWei(20, "ether")


def test_buy_more_tokens(open_crowdsale, token, customer, beneficiary, web3):
  """User can buy more tokens."""

  initial_balance = token.call().balanceOf(beneficiary)

  web3.eth.sendTransaction({
      "from": customer,
      "to": open_crowdsale.address,
      "value": Web3.toWei(20, "ether"),
      "gas": 250000,
  })

  web3.eth.sendTransaction({
      "from": customer,
      "to": open_crowdsale.address,
      "value": Web3.toWei(20, "ether"),
      "gas": 250000,
  })

  events = token.pastEvents("Transfer").get()
  assert len(events) == 2
  for e in events:
    assert e["args"]["to"].lower() == customer
    assert e["args"]["from"].lower() == beneficiary
    assert e["args"]["value"] == 24000

  assert token.call().balanceOf(beneficiary) == initial_balance - 24000 * 2
  assert token.call().balanceOf(customer) == 24000 * 2

  # We get crowdsale event
  events = open_crowdsale.pastEvents("FundTransfer").get()
  assert len(events) == 2
  e = events[-1]
  assert e["args"]["backer"].lower() == customer
  assert e["args"]["amount"] == Web3.toWei(20, "ether")
  assert e["args"]["amountRaised"] == Web3.toWei(20, "ether") * 2


def test_buy_rounded_to_zero(open_crowdsale, token, customer, beneficiary,
                             web3):
  """Too small buy in gives an error."""

  with pytest.raises(TransactionFailed):
    web3.eth.sendTransaction({
        "from": customer,
        "to": open_crowdsale.address,
        "value": 1,  # 1 wei
        "gas": 250000,
    })


def test_buy_too_many_tokens(open_crowdsale, token, customer, beneficiary,
                             web3):
  """One cannot out buy the maximum token allocation."""

  buy_everything_amount = open_crowdsale.call().getPrice(
  ) * open_crowdsale.call().maxGoal()

  web3.eth.sendTransaction({
      "from": customer,
      "to": open_crowdsale.address,
      "value": buy_everything_amount,
      "gas": 200000,
  })

  events = token.pastEvents("Transfer").get()
  assert len(events) == 1
  e = events[0]
  assert e["args"]["to"].lower() == customer
  assert e["args"]["from"].lower() == beneficiary
  assert e["args"]["value"] == open_crowdsale.call().maxGoal()

  # Cannot buy a single token more
  with pytest.raises(TransactionFailed):
    web3.eth.sendTransaction({
        "from": customer,
        "to": open_crowdsale.address,
        "value":
        open_crowdsale.call().getPrice(),  # Minimum value to buy one token
        "gas": 200000,
    })


def test_buy_tokens_too_early(early_crowdsale, token, customer, beneficiary,
                              web3):
  """One cannot participate to the crowdsale too early."""
  with pytest.raises(TransactionFailed):
    web3.eth.sendTransaction({
        "from": customer,
        "to": early_crowdsale.address,
        "value": Web3.toWei(20, "ether"),
        "gas": 250000,
    })


def test_call_check_goal_reached_too_early(open_crowdsale, token, customer,
                                           beneficiary, web3):
  """Checking goal reached does nothing unless ICO is over."""
  open_crowdsale.transact().checkGoalReached()
  assert open_crowdsale.call().crowdsaleClosed() == False


def test_call_check_goal_reached_after_close(finished_crowdsale, token,
                                             customer, beneficiary, web3):
  """Checking goal reached closes crowdsale if we are the past end deadline."""
  finished_crowdsale.transact().checkGoalReached()
  assert finished_crowdsale.call().crowdsaleClosed() == True


def test_check_goal_not_reached(open_crowdsale: Contract,
                                token: Contract,
                                customer,
                                beneficiary,
                                web3,
                                end):
  """Crowdsale may not reach its minimum funding goal."""

  # Buy some tokens
  web3.eth.sendTransaction({
      "from": customer,
      "to": open_crowdsale.address,
      "value": Web3.toWei(20, "ether"),
      "gas": 250000,
  })

  open_crowdsale.transact().setCurrent(end + 1)
  finished_crowdsale = open_crowdsale

  finished_crowdsale.transact().checkGoalReached()
  assert finished_crowdsale.call().fundingGoalReached() == False


def test_check_burn(open_crowdsale, token, customer, beneficiary, web3, end):
  """Extra tokens are burnt as described as the end of the ICO."""

  minimum_goal_value = open_crowdsale.call().fundingGoal(
  ) * open_crowdsale.call().getPrice()

  # Buy some tokens
  web3.eth.sendTransaction({
      "from": customer,
      "to": open_crowdsale.address,
      "value": minimum_goal_value,
      "gas": 250000,
  })

  # Close
  token.transact().setCurrent(end + 1)
  finished_token = token

  open_crowdsale.transact().setCurrent(end + 1)
  finished_crowdsale = open_crowdsale

  # Supply before burn
  supply_before_burn = token.call().totalSupply()
  owner_before_burn = token.call().balanceOf(beneficiary)
  assert not finished_token.call().burned()

  # Trigger goal check
  finished_crowdsale.transact().checkGoalReached()
  assert finished_crowdsale.call().fundingGoalReached()

  # We get crowdsale over event
  events = finished_crowdsale.pastEvents("GoalReached").get()
  assert len(events) == 1

  # We burned succesfully
  assert finished_token.call().burned()
  assert token.call().totalSupply() < supply_before_burn
  assert token.call().balanceOf(beneficiary) < owner_before_burn

  # Burned event gives us the diff
  events = finished_token.pastEvents("Burned").get()
  assert len(events) == 1
  e = events[0]
  assert e["args"]["amount"] == 390000000


def test_no_transfer_before_close(open_crowdsale, token, customer, beneficiary,
                                  empty_address, web3, end):
  """Buyer cannot transfer tokens before ICO is over."""

  web3.eth.sendTransaction({
      "from": customer,
      "to": open_crowdsale.address,
      "value": Web3.toWei(20, "ether"),
      "gas": 250000,
  })

  amount = 4000
  with pytest.raises(TransactionFailed):
    token.transact({"from": customer}).transfer(empty_address, amount)

  token.transact().setCurrent(end + 1)
  token.transact({"from": customer}).transfer(empty_address, amount)

  assert token.call().balanceOf(empty_address) == amount


def test_refund(open_crowdsale, token, customer, beneficiary, multisig,
                empty_address, web3, end):
  """Refunding failed ICO gives ETH back correctly."""

  customer_original_balance = web3.eth.getBalance(customer)
  multisig_original_balance = web3.eth.getBalance(multisig)

  web3.eth.sendTransaction({
      "from": customer,
      "to": open_crowdsale.address,
      "value": Web3.toWei(20, "ether"),
      "gas": 250000,
  })

  assert open_crowdsale.call().balanceOf(customer) == Web3.toWei(20, "ether")
  assert web3.eth.getBalance(multisig) > multisig_original_balance + Web3.toWei(
      20, "ether") - 500000

  # ICO ends
  open_crowdsale.transact().setCurrent(end + 1)
  finished_crowdsale = open_crowdsale

  # We did not finish
  finished_crowdsale.transact().checkGoalReached()
  assert not finished_crowdsale.call().fundingGoalReached()

  assert web3.eth.getBalance(customer) < customer_original_balance

  # Load balance back to the crowdsale
  web3.eth.sendTransaction({
      "from": multisig,
      "to": finished_crowdsale.address,
      "value": web3.eth.getBalance(multisig) - 250000,
      "gas": 250000,
  })

  # Customer 1 demands refund
  finished_crowdsale.transact({"from": customer}).safeWithdrawal()
  assert open_crowdsale.call().balanceOf(customer) == 0
  assert web3.eth.getBalance(customer) > customer_original_balance - 500000
