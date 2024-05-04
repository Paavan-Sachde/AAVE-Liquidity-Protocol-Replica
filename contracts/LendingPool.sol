// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LendingPoolCore.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingPool {
    LendingPoolCore public core;
    IERC20 public token;
    mapping(address => uint256) public aTokenBalance;

    constructor(address coreAddress, address tokenAddress) {
        core = LendingPoolCore(coreAddress);
        token = IERC20(tokenAddress);
    }

    function deposit(uint256 amount) external payable {
        token.transferFrom(msg.sender, address(this), amount);
        core.deposit(msg.sender, amount);
        // Mint aTokens to the user based on the deposited amount
        aTokenBalance[msg.sender] += amount;
    }

    function withdraw(uint256 amount) external payable {
        core.withdraw(msg.sender, amount);
        token.transfer(msg.sender, amount);
        // Burn aTokens equivalent to the withdrawn amount
        aTokenBalance[msg.sender] -= amount;
    }

    function borrow(uint256 amount) external payable  {
        core.borrow(msg.sender, amount);
        token.transfer(msg.sender, amount);
    }

    function repay(uint256 amount) external payable {
        token.transferFrom(msg.sender, address(this), amount);
        core.repay(msg.sender, amount);
    }

    function liquidate(address borrower) external {
        core.liquidate(borrower);
    }
}
