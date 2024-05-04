// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AToken is ERC20 {
    address public owner;

    mapping(address => uint256) public userBalanceIndex;
    mapping(address => uint256) public principalBalance;
    mapping(address => address) public redirectionAddress;
    mapping(address => uint256) public redirectedBalance;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        owner = msg.sender;
    }

    function deposit(uint256 _amount) external {
        _mint(msg.sender, _amount);
        principalBalance[msg.sender] += _amount;
        userBalanceIndex[msg.sender] = calculateNormalizedIncome();
    }

    function redeem(uint256 _amount) external {
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");
        _burn(msg.sender, _amount);
        principalBalance[msg.sender] -= _amount;
        userBalanceIndex[msg.sender] = calculateNormalizedIncome();
    }

    function redirectInterest(address _newRedirectionAddress) external {
        require(_newRedirectionAddress != address(0), "Invalid redirection address");
        redirectionAddress[msg.sender] = _newRedirectionAddress;
        userBalanceIndex[msg.sender] = calculateNormalizedIncome();
    }

    function calculateNormalizedIncome() internal view returns (uint256) {
        // Simplified calculation for normalized income
        return block.timestamp; // Use a more complex calculation in a real scenario
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        if (redirectionAddress[msg.sender] != address(0)) {
            redirectedBalance[redirectionAddress[msg.sender]] += principalBalance[msg.sender];
        }
        super.transfer(recipient, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        if (redirectionAddress[sender] != address(0)) {
            redirectedBalance[redirectionAddress[sender]] += principalBalance[sender];
        }
        super.transferFrom(sender, recipient, amount);
        return true;
    }
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}
