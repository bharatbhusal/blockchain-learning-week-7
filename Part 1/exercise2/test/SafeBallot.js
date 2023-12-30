const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SafeBallot", function () {
    let safeBallot;
    let owner;
    let alice;
    let bob;

    beforeEach(async function () {
        [owner, alice, bob] = await ethers.getSigners();

        const SafeBallot = await ethers.getContractFactory("SafeBallot");
        safeBallot = await SafeBallot.deploy();
        await safeBallot.deployed();
    });

    it("Try Exploit", async function () {
        // expect(await safeBallot.connect(alice).voteFor1());

    });

});