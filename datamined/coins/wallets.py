"""
Implementations of data validators.
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import tempfile
from populus import Project

class Wallet(object):
  """Abstract base class for coin wallets."""

  def __init__(self, private_key=None):
    """Initializes wallet and stores private key approporiately"""
    raise NotImplementedError

  def get_balance(self):
    """Returns a count of the number of tokens in the wallet..

    Subclasses will want to override this method depending on how the data
    should be validated properly. 

    Returns
    -------
    balance: int 
      A count of the number of tokens in the wallet.
    """
    raise NotImplementedError

  def deposit(self, value):
    """Deposits this value.
  
    Parameter
    ---------
    value: uint
      Added to internal coin count.
    """
    raise NotImplementedError

  def withdraw(self, value):
    """Decrements balance by this value.
  
    Parameter
    ---------
    value: uint
      Subtracted from internal coin count.
    """
    raise NotImplementedError

class ExampleWallet(object):
  """Dummy wallet with local coin count (not on blockchain)."""

  def __init__(self):
    """Initializes wallet

    This simple dummy wallet doesn't use encryption.
    """
    self.balance = 0

  def get_balance(self):
    """Returns a count of the number of tokens in the wallet..

    Subclasses will want to override this method depending on how the data
    should be validated properly. 

    Returns
    -------
    balance: int 
      A count of the number of tokens in the wallet.
    """
    return self.balance

  def deposit(self, value):
    """Deposits this value.
  
    Parameter
    ---------
    value: uint
      Added to internal coin count.
    """
    if not value > 0:
      raise ValueError("value must be positive") 
    self.balance += value 
    

  def withdraw(self, value):
    """Decrements balance by this value.
  
    Parameter
    ---------
    value: uint
      Subtracted from internal coin count.
    """
    if not value > 0:
      raise ValueError("value must be positive") 
    self.balance -= value 

class LocalGethWallet(Wallet):
  """A wallet that deals with DataCoins on a local Geth node."""

  def __init__(self):
    """Initializes wallet.

    TODO(rbharath): Using populus projects here is pretty awkward.
    Might be worthwhile factoring out this dependence and just having
    a local class.

    Parameters
    ----------
    project: populus.Project
     Project that chain is running under.
    """
    # TODO(rbharath): Replace this with a command-line config.
    self.project = Project("/home/rbharath/datamined/datacoin")
    with self.project.get_chain('local') as chain:
      self.wallet, _ = chain.provider.get_or_deploy_contract("Wallet")

  def deposit(self, value):
    """Deposits this value.
  
    Parameter
    ---------
    value: uint
      Added to internal coin count.
    """
    with self.project.get_chain('local') as chain:
      # Make a deposit into the wallet
      deposit_txn_hash = self.wallet.transact().deposit(value)
      chain.wait.for_receipt(deposit_txn_hash)

  def withdraw(self, value):
    """Decrements balance by this value.
  
    Parameter
    ---------
    value: uint
      Subtracted from internal coin count.
    """
    with self.project.get_chain('local') as chain:
      # Make a withdrawal from the wallet
      withdraw_txn_hash = self.wallet.transact().withdraw(value)
      chain.wait.for_receipt(withdraw_txn_hash)

  def get_balance(self):
    """Returns a count of the number of tokens in the wallet..

    Returns
    -------
    balance: int 
      A count of the number of tokens in the wallet.
    """
    with self.project.get_chain('local') as chain:
      # Make a withdrawal from the wallet
      balance = self.wallet.call().getBalance()
      return balance
