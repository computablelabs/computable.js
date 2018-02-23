// ./contracts/Wallet.sol
contract Wallet {
    mapping (address => uint) public balanceOf;

    function deposit(uint value) {
        balanceOf[msg.sender] += value;
    }

    function withdraw(uint value) {
        if (balanceOf[msg.sender] < value) throw;
        balanceOf[msg.sender] -= value;
        // TODO(rbharath): This was in original file. Does commenting
        // it out cause issues?
        //if (!msg.sender.call.value(value)()) throw;
    }

    function getBalance() returns (uint) {
        return balanceOf[msg.sender];
    }
}
