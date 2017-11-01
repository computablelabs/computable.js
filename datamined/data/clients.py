"""
Implementations of data clients.
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import tempfile


class Client(object):
  """Abstract base class for user clients."""

  def __init__(self, private_key):
    """Initializes client and stores private key approporiately"""
    raise NotImplementedError

  def store(self, data, validator):
    """Stores the data provided.

    Subclasses will want to override this method depending on where the data
    should be stored and based on the security guarantees desired. 

    Parameters
    ----------
    data: String
      Stores the specified data.
    validator: Validator
      Returns true if data is actually valid.

    Returns
    -------
    ledger: A record of where the data was stored. Details vary on
            implementation.
    """
    raise NotImplementedError

  def retrieve(self, ledger):
    """Retrieves the data associated with ledger.
    
    Uses this client's private key to attempt retrieval. Will raise error if
    key does not function.
    """
    raise NotImplementedError

  def get_ledger_key(self, ledger):
    """Gets an access key to access data associated with ledger.

    Parameters 
    ----------
    ledger: A record of where the data was stored. Details vary on
            implementation.

    Returns 
    -------
    ledger_key: An access key that permits reading the data stored in the
                associated ledger. 
    """
    raise NotImplementedError

  def get_wallet(self):
    """Returns access to wallet

    Returns 
    ----------
    wallet: dm.coins.Wallet 
      The wallet associated with this client.
    """
    raise NotImplementedError


class InsecureFileClient(Client):
  """Stores data locally on disk. No guarantees on security."""

  def __init__(self, private_key, wallet):
    """Initializes client.

    Ignores private key (since no encryption used.) Creates a temporary
    directory that's used to store data for this client.

    Parameters
    ----------
    private_key: str
      Private key for this wallet. Ignored.
    wallet: dm.coins.Wallet
      Wallets used to store coins for this client.
    """
    self.wallet = wallet
    self.data_dir = tempfile.mkdtemp()

    # TODO(rbharath): This increment should be factored out somehow, likely
    # into a solidity contract.
    self.data_reward = 1.0

  def store(self, data, validator):
    """Stores provided data.
  
    Simply writes to a new file in data_dir. No encryption is used. Note that
    this implementation doesn't close the files. Should probalby fix that later.
    """
    with tempfile.NamedTemporaryFile(
        dir=self.data_dir, delete=False, mode="w+") as data_file:
      if validator.is_valid(data):
        data_file.write(data)
        # Increment wallet token count
        self.wallet.deposit(self.data_reward)
      else:
        raise ValueError("This data is not valid")
      return data_file.name

  def retrieve(self, ledger):
    """Retrieves stored data

    Parameters
    ----------
    ledger: string
      In this case, ledger is simply a file name.
    """
    with open(ledger) as data_file:
      return data_file.read()

  def get_ledger_key(self, ledger):
    """Gets an access key to access data associated with ledger.

    Parameters 
    ----------
    ledger: As returned by store.

    Returns 
    -------
    ledger_key: Simply None, since no key for insecure system. 
    """
    return None

  def get_wallet(self):
    """Returns access to wallet

    Returns 
    ----------
    wallet: dm.coins.Wallet 
      The wallet associated with this client.
    """
    return self.wallet
