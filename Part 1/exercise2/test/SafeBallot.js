const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SafeBallot', function () {
    let safeBallot;
    let owner;
    let user;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        const SafeBallot = await ethers.getContractFactory('SafeBallot');
        safeBallot = await SafeBallot.deploy();
        await safeBallot.deployed();
    });

    it('should deploy with initial token balance', async function () {
        const ownerBalance = await safeBallot.balanceOf(owner.address);
        expect(ownerBalance).to.equal(500);
    });

    it('should allow users to vote for proposal1', async function () {
        await safeBallot.connect(user).voteFor1();
        const userBalance = await safeBallot.balanceOf(user.address);
        const proposal1VoteCount = await safeBallot.proposal1VoteCount();

        expect(userBalance).to.equal(0);
        expect(proposal1VoteCount).to.equal(1);
    });

    it('should allow users to vote for proposal2', async function () {
        await safeBallot.connect(user).voteFor2();
        const userBalance = await safeBallot.balanceOf(user.address);
        const proposal2VoteCount = await safeBallot.proposal2VoteCount();

        expect(userBalance).to.equal(0);
        expect(proposal2VoteCount).to.equal(1);
    });

    it('should not allow users to vote twice', async function () {
        await safeBallot.connect(user).voteFor1();

        await expect(safeBallot.connect(user).voteFor2()).to.be.revertedWith('already voted');
    });
});
