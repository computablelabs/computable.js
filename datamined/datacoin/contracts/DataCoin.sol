/**
 * The DataCoin token contract complies with the ERC20 standard (see
 * https://github.com/ethereum/EIPs/issues/20).  Additionally tokens
 * can be locked for a defined time interval by token holders.  The
 * owner's share of tokens is locked for the first 360 days and all
 * tokens not being sold during the crowdsale but 60.000.000 (owner's
 * share + bounty program) are burned.
 * Author: Julia Altenried
 * */

pragma solidity ^0.4.6;
contract tokenRecipient {
  function receiveApproval(address _from,
                           uint256 _value,
                           address _token,
                           bytes _extraData);
}

import "./TestableNow.sol";
import "./SafeMath.sol";

contract DataCoin is SafeMath, TestableNow {
    /* Public variables of the token */
    string public standard = 'ERC20';
    string public name = 'DataCoin';
    string public symbol = 'EDG';
    uint8 public decimals = 0;
    uint256 public totalSupply;
    address public owner;
    /* from this time on tokens may be transfered (after ICO)*/
    // TODO(rbharath): What should startTime be changed to?
    uint256 public startTime = 1490112000;
    /* tells if tokens have been burned already */
    bool public burned;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;


    /* This generates a public event on the blockchain that will
    * notify clients */
    event Transfer(address indexed from,
                   address indexed to,
                   uint256 value);
    event Approval(address indexed owner,
                   address indexed spender,
                   uint256 value);
    event Burned(uint amount);

    /* Initializes contract with initial supply tokens to the creator
    * of the contract */
    function DataCoin(address _owner) {
        // Owner is the crowdsale contract
        owner = _owner;
        // Give the owner all initial tokens
        balanceOf[owner] = 500000000;              
        // Update total supply
        totalSupply = 500000000;                   
    }


    /* Send some of your tokens to a given address */
    function transfer(address _to, uint256 _value)
        returns (bool success)
    {
        //check if the crowdsale is already over
        if (current() < startTime) throw; 
        //prevent the owner of spending his share of tokens within
        //the first year
        if(msg.sender == owner && current() < startTime + 1 years && safeSub(balanceOf[msg.sender],_value) < 50000000) throw; 
        // Subtract from the sender
        balanceOf[msg.sender] = safeSub(balanceOf[msg.sender],_value);
        // Add the same to the recipient
        balanceOf[_to] = safeAdd(balanceOf[_to],_value);  
        // Notify anyone listening that this transfer took place
        Transfer(msg.sender, _to, _value);
        return true;
    }

    /* Allow another contract or person to spend some tokens in your
    * behalf */
    function approve(address _spender, uint256 _value)
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }


    /* A contract or  person attempts to get the tokens of somebody
     * else.  This is only allowed if the token holder approved. */
    function transferFrom(address _from, address _to, uint256 _value)
        returns (bool success)
    {
        //check if the crowdsale is already over
        if (current() < startTime && _from!=owner) throw; 
        //prevent the owner of spending his share of tokens within
        //the first year
        if(_from == owner &&
           current() < startTime + 1 years &&
           safeSub(balanceOf[_from],_value) < 50000000) throw; 
        var _allowance = allowance[_from][msg.sender];
        // Subtract from the sender
        balanceOf[_from] = safeSub(balanceOf[_from],_value); 
        // Add the same to the recipient
        balanceOf[_to] = safeAdd(balanceOf[_to],_value);     
        allowance[_from][msg.sender] = safeSub(_allowance,_value);
        Transfer(_from, _to, _value);
        return true;
    }


    /* to be called when ICO is closed, burns the remaining tokens
     * but the owners share (50 000 000) and the ones reserved for
     * the bounty program (10 000 000).  anybody may burn the tokens
     * after ICO ended, but only once (in case the owner holds more
     * tokens in the future).  this ensures that the owner will not
     * posses a majority of the tokens. */
    function burn(){
    	//if tokens have not been burned already and the ICO ended
    	if(!burned && current()>startTime){
        //checked for overflow above
    		uint difference = safeSub(balanceOf[owner], 60000000);
    		balanceOf[owner] = 60000000;
    		totalSupply = safeSub(totalSupply, difference);
    		burned = true;
    		Burned(difference);
    	}
    }

}
