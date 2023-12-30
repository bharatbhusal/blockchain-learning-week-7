// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SafeBank {
    mapping(address => uint256) private balances;
    mapping(address => bool) private authorized;

    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Not authorized");
        _;
    }

    modifier nonReentrant() {
        require(!inWithdrawal[msg.sender], "Reentrant call");
        inWithdrawal[msg.sender] = true;
        _;
        inWithdrawal[msg.sender] = false;
    }

    mapping(address => bool) private inWithdrawal;

    // Set the caller as an authorized address
    function authorize() public {
        authorized[msg.sender] = true;
    }

    // Revoke authorization from an address
    function revokeAuthorization(address account) public onlyAuthorized {
        authorized[account] = false;
    }

    // Deposit funds on behalf of the specified address
    function deposit(address onBehalfOf) public payable {
        require(onBehalfOf != address(0), "Invalid address");
        balances[onBehalfOf] += msg.value;
    }

    // Withdraw funds from the specified address
    function withdraw(
        address from,
        uint256 amount
    ) public onlyAuthorized nonReentrant {
        require(from != address(0), "Invalid address");
        require(balances[from] >= amount, "Insufficient balance");
        require(amount > 0, "Invalid withdrawal amount");

        balances[from] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // Get the balance of a specific address
    function getBalance(address account) public view returns (uint256) {
        return balances[account];
    }
}
