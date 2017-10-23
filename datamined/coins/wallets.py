"""
Implementations of data validators.
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import tempfile

class Wallet(object):
  """Abstract base class for coin wallets."""

  def __init__(self, private_key=None):
    """Initializes wallet and stores private key approporiately"""
    raise NotImplementedError

  def token_count(self):
    """Returns a count of the number of tokens in the wallet..

    Subclasses will want to override this method depending on how the data
    should be validated properly. 

    Returns
    -------
    token_count: int 
      A count of the number of tokens in the wallet.
    """
    raise NotImplementedError

  def increment(self, amount):
    """Increments count by this amount.
  
    Parameter
    ---------
    amount: int
      Added to internal coin count.
    """
    raise NotImplementedError

  def decrement(self, amount):
    """Decrements count by this amount.
  
    Parameter
    ---------
    amount: int
      Subtracted from internal coin count.
    """
    raise NotImplementedError

class ExampleWallet(object):
  """Dummy wallet with local coin count (not on blockchain)."""

  def __init__(self):
    """Initializes wallet

    This simple dummy wallet doesn't use encryption.
    """
    self.num_tokens = 0

  def token_count(self):
    """Returns a count of the number of tokens in the wallet..

    Subclasses will want to override this method depending on how the data
    should be validated properly. 

    Returns
    -------
    num_tokens: int 
      A count of the number of tokens in the wallet.
    """
    return self.num_tokens

  def increment(self, amount):
    """Increments count by this amount.
  
    Parameter
    ---------
    amount: int
      Added to internal coin count.
    """
    if not amount > 0:
      raise ValueError("amount must be positive") 
    self.num_tokens += amount
    

  def decrement(self, amount):
    """Decrements count by this amount.
  
    Parameter
    ---------
    amount: int
      Subtracted from internal coin count.
    """
    if not amount > 0:
      raise ValueError("amount must be positive") 
    self.num_tokens -= amount
