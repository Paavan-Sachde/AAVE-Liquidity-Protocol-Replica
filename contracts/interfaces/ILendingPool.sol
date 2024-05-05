// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ISwapRouter.sol";

interface ILendingPool {
    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external payable ;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external payable returns (uint256);
}

interface IWETHGateway {
    function depositETH(
        address lendingPool,
        address onBehalfOf,
        uint16 referralCode
    ) external payable;

    function withdrawETH(
        address lendingPool,
        uint256 amount,
        address onBehalfOf
    ) external payable ;
}

interface IUniswapRouter is ISwapRouter {
    function refundETH() external payable;
}