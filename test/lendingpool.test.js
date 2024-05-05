// Import necessary modules from Hardhat and ethers.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LendingPool Contract", function () {
  let LendingPoolCore, AToken, LendingPool;
  let lendingPoolCore, aToken, lendingPool;
  let owner, user;

  // Deploy the contracts before each test
  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy LendingPoolCore contract
    LendingPoolCore = await ethers.getContractFactory("LendingPoolCore");
    lendingPoolCore = await LendingPoolCore.deploy();

    // Deploy AToken contract
    AToken = await ethers.getContractFactory("AToken");
    aToken = await AToken.deploy("AToken", "ATK");

    // Deploy LendingPool contract
    LendingPool = await ethers.getContractFactory("LendingPool");
    lendingPool = await LendingPool.deploy(lendingPoolCore.address, aToken.address);

    // Transfer tokens to the user for testing
    const initialSupply = ethers.utils.parseEther("1000");
    await aToken.mint(user.address, initialSupply);
    await aToken.connect(user).approve(lendingPool.address, initialSupply);
  });

  it("should deposit tokens and mint aTokens", async function () {
    const amount = ethers.utils.parseEther("1");

    // User deposits tokens into the lending pool
    await lendingPool.connect(user).deposit(amount);

    // Check the user's aToken balance after deposit
    const userATokenBalance = await aToken.balanceOf(user.address);
    expect(userATokenBalance).to.equal(amount);

    // Check the lending pool's total deposit balance
    const totalDeposit = await lendingPool.totalDeposit();
    expect(totalDeposit).to.equal(amount);

    // Check the user's balance in the lending pool
    const userBalance = await lendingPool.core().balances(user.address);
    expect(userBalance).to.equal(amount);
  });

  it("should allow borrowing and repaying tokens", async function () {
    const borrowAmount = ethers.utils.parseEther("0.5");

    // User borrows tokens from the lending pool
    await lendingPool.connect(user).borrow(borrowAmount);

    // Check the user's borrowed amount
    const userBorrowed = await lendingPool.core().borrowings(user.address);
    expect(userBorrowed).to.equal(borrowAmount);

    // User repays the borrowed tokens
    await lendingPool.connect(user).repay(borrowAmount);

    // Check the user's borrowed amount after repayment
    const userBorrowedAfterRepay = await lendingPool.core().borrowings(user.address);
    expect(userBorrowedAfterRepay).to.equal(0);
  });

  // Add more test cases as needed for other functions

});
