// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*
EtherStore is a contract where you can deposit and withdraw ETH.
This contract is vulnerable to re-entrancy attack.

What happened?
Attack was able to call EtherStore.withdraw multiple times before
EtherStore.withdraw finished executing.

Here is how the functions were called
- Attack.attack
- EtherStore.deposit
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack.fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
*/

contract EtherStoreSecure {
    mapping(address => uint) public balances;
    mapping(address => bool) private reentrancyGaurd;

    function deposit() public payable {
        require(msg.value >= 1 ether, "cannot deposit below 1 ether");
        require(!reentrancyGaurd[msg.sender], "External Call detected");
        reentrancyGaurd[msg.sender] = true;
        balances[msg.sender] += msg.value;
        reentrancyGaurd[msg.sender] = false;
    }

    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);
        require(!reentrancyGaurd[msg.sender], "External Call detected");
        reentrancyGaurd[msg.sender] = true;

        balances[msg.sender] = 0;
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        reentrancyGaurd[msg.sender] = false;
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
