const { expect } = require("chai");

describe("Borrowing", function () {
    let Borrowing;
    let borrowing;
    let token;

    beforeEach(async function () {
        Borrowing = await ethers.getContractFactory("Borrowing");
        borrowing = await Borrowing.deploy(/* pass constructor arguments if required */);

        // Deploy a mock ERC20 token for testing
        const Token = await ethers.getContractFactory("YourTokenContract");
        token = await Token.deploy(/* constructor arguments if required */);

        // Transfer some tokens to the borrowing contract for testing
        await token.transfer(borrowing.address, ethers.utils.parseEther("1000"));
    });

    it("Should borrow tokens", async function () {
        const initialBalance = await token.balanceOf(borrowing.address);
        expect(initialBalance).to.equal(ethers.utils.parseEther("1000"));

        await borrowing.borrow(ethers.utils.parseEther("100"));

        const borrowedAmount = ethers.utils.parseEther("100");
        const borrowerBalance = await token.balanceOf(await ethers.provider.getSigner(0).getAddress());
        expect(borrowerBalance).to.equal(borrowedAmount);

        const finalBalance = await token.balanceOf(borrowing.address);
        expect(finalBalance).to.equal(initialBalance.sub(borrowedAmount));
    });

    it("Should repay borrowed tokens", async function () {
        const initialBalance = await token.balanceOf(borrowing.address);
        expect(initialBalance).to.equal(ethers.utils.parseEther("1000"));

        await borrowing.borrow(ethers.utils.parseEther("100"));

        const borrowedAmount = ethers.utils.parseEther("100");
        const borrowerBalance = await token.balanceOf(await ethers.provider.getSigner(0).getAddress());
        expect(borrowerBalance).to.equal(borrowedAmount);

        await token.connect(await ethers.provider.getSigner(0)).approve(borrowing.address, borrowedAmount);
        await borrowing.repay(borrowedAmount);

        const finalBalance = await token.balanceOf(borrowing.address);
        expect(finalBalance).to.equal(initialBalance);
    });
});
