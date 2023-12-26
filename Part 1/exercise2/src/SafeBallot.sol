// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract SafeBallot is ERC20Votes {
    uint256 public proposal1VoteCount;
    uint256 public proposal2VoteCount;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function voteFor1(uint256 amount) external {
        _vote(msg.sender, 1, amount, "");
        proposal1VoteCount += amount;
    }

    function voteFor2(uint256 amount) external {
        _vote(msg.sender, 2, amount, "");
        proposal2VoteCount += amount;
    }

    // Override _beforeTokenTransfer to update voting power before each transfer
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);
        _moveVotingPower(from, to, amount);
    }
}
