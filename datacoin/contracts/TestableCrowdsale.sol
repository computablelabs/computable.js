/**
*	Crowdsale for Edgeless Tokens.
*	Raised Ether will be stored safely at a multisignature wallet and returned to the ICO in case the funding goal is not reached,
*   allowing the investors to withdraw their funds.
*	Author: Julia Altenried
**/

pragma solidity ^0.4.6;

import "./TestableNow.sol";
import "./SafeMath.sol";

contract token {
	function transferFrom(address sender, address receiver, uint amount) returns(bool success){}
	function burn() {}
}

contract Crowdsale is SafeMath, TestableNow {
    /* tokens will be transfered from this address */
	address public beneficiary = 0;
	/* if the funding goal is not reached, investors may withdraw their funds */
	uint public fundingGoal = 50000000;
	/* the maximum amount of tokens to be sold */
	uint public maxGoal = 440000000;
	/* how much has been raised by crowdale (in ETH) */
	uint public amountRaised;
	/* the start date of the crowdsale */
	uint public start = 1488294000;
	/* the number of tokens already sold */
	uint public tokensSold;
	/* there are different prices in different time intervals */
	uint[4] public deadlines = [1488297600, 1488902400, 1489507200,1490112000];
	uint[4] public prices = [833333333333333, 909090909090909,952380952380952, 1000000000000000];
	/* the address of the token contract */
	token public tokenReward;
	/* the balances (in ETH) of all investors */
	mapping(address => uint256) public balanceOf;
	/* indicated if the funding goal has been reached. */
	bool public fundingGoalReached = false;
	/* indicates if the crowdsale has been closed already */
	bool public crowdsaleClosed = false;
	/* the multisignature wallet on which the funds will be stored */
	address msWallet = 0;
	/* notifying transfers and the success of the crowdsale*/
	event GoalReached(address beneficiary, uint amountRaised);
	event FundTransfer(address backer, uint amount, bool isContribution, uint amountRaised);


    /*  initialization, set the token address */
    function Crowdsale(address _beneficiary, address _msWallet, uint _start) {
        beneficiary = _beneficiary;
        msWallet = _msWallet;

        // Allow to override the start time to test the contract in
        // testnet
        if(_start > 0) {
            start = _start;
        }
    }

    /* Build circular references between contracts. Only in test version. */
    function setToken(address _token) public {
        if(msg.sender != beneficiary) throw;
        if(address(tokenReward) != 0) throw; // No double set
        tokenReward = token(_token);
    }
    /* invest by sending ether to the contract. */
    function () payable{
      if(msg.sender != msWallet) //do not trigger investment if the multisig wallet is returning the funds
            invest(msg.sender);
    }

    /* Make an investment. only callable if the crowdsale started and
     * hasn't been closed already and the maxGoal wasn't reached yet.
     * the current token price is looked up and the corresponding
     * number of tokens is transfered to the receiver.  the sent
     * value is directly forwarded to a safe multisig wallet.  this
     * method allows to purchase tokens in behalf of another
     * address.*/
    function invest(address receiver) payable{
    	uint amount = msg.value;
    	uint price = getPrice();
    	if(price > amount) throw;
		uint numTokens = amount / price;
		if (crowdsaleClosed||current()<start||safeAdd(tokensSold,numTokens)>maxGoal) throw;
		if(!msWallet.send(amount)) throw;
		balanceOf[receiver] = safeAdd(balanceOf[receiver],amount);
		amountRaised = safeAdd(amountRaised, amount);
		tokensSold+=numTokens;
		if(!tokenReward.transferFrom(beneficiary, receiver, numTokens)) throw;
        FundTransfer(receiver, amount, true, amountRaised);
    }

    /* looks up the current token price */
    function getPrice() constant returns (uint256 price){
        for(var i = 0; i < deadlines.length; i++)
            if(current()<deadlines[i])
                return prices[i];
        //should never be returned, but to be sure to not divide by 0
        return prices[prices.length-1];
    }

    modifier afterDeadline() { if (current() >= deadlines[deadlines.length-1]) _; }

    /* checks if the goal or time limit has been reached and ends the
    * campaign */
    function checkGoalReached() afterDeadline {
        if (tokensSold >= fundingGoal){
            fundingGoalReached = true;
            tokenReward.burn(); //burn remaining tokens but 60 000 000
            GoalReached(beneficiary, amountRaised);
        }
        crowdsaleClosed = true;
    }

    /* allows the funders to withdraw their funds if the goal has not
     * been reached.  only works after funds have been returned from
    * the multisig wallet. */
	function safeWithdrawal() afterDeadline {
		uint amount = balanceOf[msg.sender];
		if(address(this).balance >= amount){
			balanceOf[msg.sender] = 0;
			if (amount > 0) {
				if (msg.sender.send(amount)) {
					FundTransfer(msg.sender, amount, false, amountRaised);
				} else {
					balanceOf[msg.sender] = amount;
				}
			}
		}
  }

}
