// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingPoolCore {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public borrowings;
    mapping(address => uint256) public debt;

    IERC20 public token;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    event TransferSent(address from, address to, uint256 amount);

    function transferToken(address to, uint256 amount) external payable {
        uint256 bal = token.balanceOf(address(this));
        require(amount <= bal, "Balance is low");
        token.transfer(to, amount);
        emit TransferSent(msg.sender, to, amount);
    }

    function deposit(address depositor, uint256 amount) external  {
        balances[depositor] += amount;
    }

    function withdraw(address withdrawer, uint256 amount) external payable {
        require(balances[withdrawer] >= amount, "Insufficient balance");
        
        balances[withdrawer] -= amount;
    }

    function borrow(address borrower, uint256 amount) external   {
        require(balances[borrower] >= amount, "Insufficient balance");
        borrowings[borrower] += amount;
        debt[borrower] += amount;
    }

    function repay(address borrower, uint256 amount) external  {
        require(debt[borrower] >= amount, "Exceeds debt");
        debt[borrower] -= amount;
    }

    function liquidate(address borrower) external   {
        uint256 amountToLiquidate = debt[borrower];
        require(amountToLiquidate > 0, "No debt to liquidate");
        balances[msg.sender] -= amountToLiquidate;
        balances[borrower] += amountToLiquidate;
        debt[borrower] = 0;
    }
    function getAddrbalance(address _accountAddress)
    public 
    view 
    returns (uint256){
        return _accountAddress.balance;
    }
}
