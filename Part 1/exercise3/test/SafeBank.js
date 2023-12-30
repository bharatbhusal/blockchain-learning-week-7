// test/SafeBank.test.js
const { expect } = require('chai');
const { ethers } = require('hardhat')

describe('SafeBank Contract', function () {
    let SafeBank;
    let safeBank;
    let owner;
    let authorizedUser;
    let unauthorizedUser;

    beforeEach(async function () {
        [owner, authorizedUser, unauthorizedUser] = await ethers.getSigners();

        // Deploy SafeBank contract
        SafeBank = await ethers.getContractFactory('SafeBank');
        safeBank = await SafeBank.deploy();
        await safeBank.deployed();
    });

    it('should authorize an address', async function () {
        await safeBank.authorize();
        expect(await safeBank.authorized(owner.address)).to.be.true;
    });

    it('should revoke authorization from an address', async function () {
        await safeBank.authorize();
        await safeBank.revokeAuthorization(owner.address);
        expect(await safeBank.authorized(owner.address)).to.be.false;
    });

    it('should deposit funds on behalf of an address', async function () {
        const depositAmount = ethers.utils.parseEther('1.0');

        await safeBank.authorize();
        await safeBank.deposit(authorizedUser.address, { value: depositAmount });

        expect(await safeBank.getBalance(authorizedUser.address)).to.equal(depositAmount);
    });

    it('should withdraw funds on behalf of an authorized address', async function () {
        const depositAmount = ethers.utils.parseEther('1.0');
        const withdrawalAmount = ethers.utils.parseEther('0.5');

        await safeBank.authorize();
        await safeBank.deposit(authorizedUser.address, { value: depositAmount });
        const initialBalance = await safeBank.getBalance(authorizedUser.address);

        await safeBank.connect(authorizedUser).withdraw(withdrawalAmount);

        const finalBalance = await safeBank.getBalance(authorizedUser.address);
        expect(finalBalance).to.equal(initialBalance.sub(withdrawalAmount));
    });

    it('should not withdraw funds from an unauthorized address', async function () {
        const depositAmount = ethers.utils.parseEther('1.0');
        const withdrawalAmount = ethers.utils.parseEther('0.5');

        await safeBank.authorize();
        await safeBank.deposit(authorizedUser.address, { value: depositAmount });

        await expect(safeBank.connect(unauthorizedUser).withdraw(withdrawalAmount)).to.be.revertedWith(
            'Not authorized'
        );
    });

    it('should not withdraw more funds than available', async function () {
        const depositAmount = ethers.utils.parseEther('1.0');
        const withdrawalAmount = ethers.utils.parseEther('1.5');

        await safeBank.authorize();
        await safeBank.deposit(authorizedUser.address, { value: depositAmount });

        await expect(safeBank.connect(authorizedUser).withdraw(withdrawalAmount)).to.be.revertedWith(
            'Insufficient balance'
        );
    });

    it('should not deposit funds with an invalid address', async function () {
        const depositAmount = ethers.utils.parseEther('1.0');

        await expect(safeBank.deposit(ethers.constants.AddressZero, { value: depositAmount })).to.be.revertedWith(
            'Invalid address'
        );
    });

    it('should not withdraw funds with an invalid address', async function () {
        const withdrawalAmount = ethers.utils.parseEther('0.5');

        await expect(safeBank.withdraw(ethers.constants.AddressZero, withdrawalAmount)).to.be.revertedWith(
            'Invalid address'
        );
    });

    it('should not withdraw zero or negative amount', async function () {
        await expect(safeBank.connect(authorizedUser).withdraw(0)).to.be.revertedWith('Invalid withdrawal amount');
        await expect(safeBank.connect(authorizedUser).withdraw(ethers.utils.parseEther('-0.5'))).to.be.revertedWith(
            'Invalid withdrawal amount'
        );
    });
});
