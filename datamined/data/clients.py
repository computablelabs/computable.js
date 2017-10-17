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
    raise NotImplementedError()

  def store(self, data):
    """Stores the data provided.

    Subclasses will want to override this method depending on where the data
    should be stored and based on the security guarantees desired. 

    Returns
    -------
    ledger: A record of where the data was stored. Details vary on
            implementation.
    """
    raise NotImplementedError()

  def retrieve(self, ledger):
    """Retrieves the data associated with ledger.
    
    Uses this client's private key to attempt retrieval. Will raise error if
    key does not function.
    """
    raise NotImplementedError()

class InsecureFileClient(Client):
  """Stores data locally on disk. No guarantees on security."""

  def __init__(self, private_key):
    """Initializes client.

    Ignores private key (since no encryption used.) Creates a temporary
    directory that's used to store data for this client.
    """
    self.data_dir = tempfile.mkdtemp()

  def store(self, data):
    """Stores provided data.
  
    Simply writes to a new file in data_dir. No encryption is used. Note that
    this implementation doesn't close the files. Should probalby fix that later.
    """
    with tempfile.NamedTemporaryFile(dir=self.data_dir, delete=False) as data_file:
      data_file.write(data)
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
