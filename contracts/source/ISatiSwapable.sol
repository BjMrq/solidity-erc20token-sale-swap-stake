// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

abstract contract ISatiSwapable {
    function requireHasEnoughSati(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view virtual;

    function requireHasEnoughSwapToken(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view virtual;

    function getAmountOfSatiFromSwapToken(uint256 _swapTokenAmount)
        public
        virtual
        returns (uint256);

    function swapSwapTokenForSati(uint256 _swapTokenAmount)
        external
        payable
        virtual;

    function getNumberOfSwapTokenFromSati(uint256 _satiAmount)
        public
        virtual
        returns (uint256);

    function swapSatiForSwapToken(uint256 _satiAmount) external payable virtual;
}
