const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EtherStore", function () {
    let etherStore;
    let attack;
    let owner;
    let alice;
    let bob;
    let eve;

    beforeEach(async function () {
        [owner, alice, bob, eve] = await ethers.getSigners();

        const EtherStore = await ethers.getContractFactory("EtherStore");
        etherStore = await EtherStore.deploy();
        await etherStore.deployed();

        const Attack = await ethers.getContractFactory("Attack")
        attack = await Attack.deploy(etherStore.address)
        await attack.deployed()
    });

    it("Exploit Vulnerability", async function () {

        const depositAmount = ethers.utils.parseEther("1");
        await etherStore.connect(alice).deposit({ value: depositAmount });
        await etherStore.connect(bob).deposit({ value: depositAmount });
        expect(await etherStore.getBalance()).to.equal(ethers.utils.parseEther("2"))

        //exploiting
        expect(await attack.connect(eve).attack({ value: depositAmount }))
        //aattack should have 0 but has 3
        expect(await attack.getBalance()).to.be.equal(ethers.utils.parseEther("3"))
        //etherstore should have 3 but has 0
        expect(await etherStore.getBalance()).to.be.equal(ethers.utils.parseEther("0"))


    });

});