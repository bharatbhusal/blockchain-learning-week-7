// A malicious voter can simply transfer their tokens to
// another address and vote again.

// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UnsafeBallot {
    uint256 public proposal1VoteCount;
    uint256 public proposal2VoteCount;

    IERC20 private immutable governanceToken;

    mapping(address => bool) public alreadyVoted;

    constructor(IERC20 _governanceToken) {
        governanceToken = _governanceToken;
    }

    function voteFor1() external notAlreadyVoted {
        proposal1VoteCount += governanceToken.balanceOf(msg.sender);
    }

    function voteFor2() external notAlreadyVoted {
        proposal2VoteCount += governanceToken.balanceOf(msg.sender);
    }

    // prevent the same address from voting twice,
    // however the attacker can simply
    // transfer to a new address
    modifier notAlreadyVoted() {
        require(!alreadyVoted[msg.sender], "already voted");
        _;
        alreadyVoted[msg.sender] = true;
    }
}
