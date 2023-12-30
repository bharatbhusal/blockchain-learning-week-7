// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract UnsafeBank {
    mapping(address => uint256) public balances;

    // allow depositing on other's behalf
    function deposit(address forAddress) public payable {
        balances[forAddress] += msg.value;
    }

    function withdraw(address from, uint256 amount) public {
        require(balances[from] <= amount, "insufficient balance");

        balances[from] -= amount;
        msg.sender.call{value: amount}("");
    }
}
