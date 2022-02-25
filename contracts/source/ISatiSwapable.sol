// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

abstract contract ISatiSwapable {
    function requireHasEnoughSati(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view virtual;

    function requireHasEnoughPairedToken(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view virtual;

    function getAmountOfSatiFromPairedToken(uint256 _ERC20TokenAmount)
        public
        virtual
        returns (uint256);

    function swapPairedTokenForSati(uint256 _ERC20TokenAmount)
        external
        payable
        virtual;

    function getNumberOfPairedTokenFromSati(uint256 _satiAmount)
        public
        virtual
        returns (uint256);

    function swapSatiForPairedToken(uint256 _satiAmount)
        external
        payable
        virtual;
}
