// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract SafeBallot is ERC20Votes {
    uint256 public proposal1VoteCount;
    uint256 public proposal2VoteCount;

    mapping(address => bool) public alreadyVoted;

    modifier notAlreadyVoted() {
        require(!alreadyVoted[msg.sender], "already voted");
        _;
        alreadyVoted[msg.sender] = true;
    }

    constructor() ERC20("VoteToken", "VTK") EIP712("VoteToken", "0.1.1") {
        _mint(msg.sender, 500);
    }

    function voteFor1() external notAlreadyVoted {
        delegate(msg.sender);
        proposal1VoteCount += 1;
    }

    function voteFor2() external notAlreadyVoted {
        delegate(msg.sender);
        proposal2VoteCount += 1;
    }
}
