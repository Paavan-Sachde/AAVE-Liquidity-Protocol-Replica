const { expect } = require("chai");

describe("LendingPool", function () {
    it("Should deposit tokens into the pool", async function () {
        const LendingPool = await ethers.getContractFactory("LendingPool");
        const lendingPool = await LendingPool.deploy(1/* constructor arguments if any */);

        console.log("Deployed LendingPool contract");

        await lendingPool.deposit(100);
        console.log("Deposited 100 tokens");

        const balance = await lendingPool.tokenBalance();
        console.log("Token balance:", balance.toString());

        expect(balance).to.equal(100);
        console.log("Deposit test passed");
    });

    it("Should withdraw tokens from the pool", async function () {
        const LendingPool = await ethers.getContractFactory("LendingPool");
        const lendingPool = await LendingPool.deploy(/* constructor arguments if any */);

        console.log("Deployed LendingPool contract");

        await lendingPool.deposit(100);
        console.log("Deposited 100 tokens");

        await lendingPool.withdraw(50);
        console.log("Withdrawn 50 tokens");

        const balance = await lendingPool.tokenBalance();
        console.log("Token balance:", balance.toString());

        expect(balance).to.equal(50);
        console.log("Withdraw test passed");
    });

    it("Should not allow withdrawing more tokens than deposited", async function () {
        const LendingPool = await ethers.getContractFactory("LendingPool");
        const lendingPool = await LendingPool.deploy(/* constructor arguments if any */);

        console.log("Deployed LendingPool contract");

        await lendingPool.deposit(100);
        console.log("Deposited 100 tokens");

        await expect(lendingPool.withdraw(101)).to.be.revertedWith("Not enough tokens in the pool");
        console.log("Withdrawal limit test passed");
    });
});
