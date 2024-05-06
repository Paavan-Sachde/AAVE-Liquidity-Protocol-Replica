// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LendingPoolCore.sol";
import "./AToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingPool {
    LendingPoolCore public core;
    IERC20 public token;
    AToken public aToken;
    mapping(address => uint256) public aTokenBalance;

    constructor(address coreAddress, address tokenAddress) {
        core = LendingPoolCore(coreAddress);
        token = IERC20(tokenAddress);
    }

    function deposit(uint256 amount) external payable {
        token.transferFrom(msg.sender, address(this), amount);
        core.deposit(msg.sender, amount);
        
        // Mint aTokens to the user based on the deposited amount
        aToken.deposit(amount);
        aTokenBalance[msg.sender] += amount;
    }

    function withdraw(uint256 amount) external payable {
        core.withdraw(msg.sender, amount);
        token.transfer(msg.sender, amount);
        payable(msg.sender).transfer(amount);
        // Burn aTokens equivalent to the withdrawn amount
        aToken.redeem(amount);
        aTokenBalance[msg.sender] -= amount;
    }
    function addCollateral() external payable {
        require(msg.value != 0, "Cant send 0 ethers");
        usersCollateral[msg.sender] += msg.value;
        totalCollateral += msg.value;
    }

    function removeCollateral(uint256 _amount) external payable {
        uint256 collateral = usersCollateral[msg.sender];
        require(collateral > 0, "Dont have any collateral");
        usersCollateral[msg.sender] -= _amount;
        totalCollateral -= _amount;
        payable(address(this)).transfer(_amount);
    }
    function borrow(uint256 amount) external payable  {
        payable(msg.sender).transfer(amount);
        core.borrow(msg.sender, amount);
        token.transfer(msg.sender, amount);
    }

    function repay(uint256 amount) external payable {
        token.transferFrom(msg.sender, address(this), amount);
        core.repay(msg.sender, amount);
    }

    function liquidate(address borrower) external payable  {
        core.liquidate(borrower);
    }
}
