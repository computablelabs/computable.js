"""
Implementations of data validators.
"""
from __future__ import print_function
from __future__ import division
from __future__ import unicode_literals

import tempfile

class Validator(object):
  """Abstract base class for data validator."""

  def __init__(self, private_key):
    """Initializes client and stores private key approporiately"""
    raise NotImplementedError

  def is_valid(self, data):
    """Test whether the data provided is valid.

    Subclasses will want to override this method depending on how the data
    should be validated properly. 

    Returns
    -------
    is_valid: Boolean 
      Whether or not this data is valid.
    """
    raise NotImplementedError


class NaiveGenomicValidator(Validator):
  """Stores data locally on disk. No guarantees on security."""

  def __init__(self):
    """Initializes this validator.
    """
    pass

  def is_valid(self, data):
    """Test whether the data provided is valid.

    Since validator is naive, always returns true.

    Returns
    -------
    is_valid: Boolean 
      Whether or not this data is valid.
    """
    return True 
