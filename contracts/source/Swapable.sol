// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Ratable.sol";
import "./Utils.sol";
import "./ISatiSwapable.sol";

abstract contract Swapable is Ratable, Utils, ISatiSwapable {
    uint8 precisionDecimals = 18;

    event SwapTransfer(
        address indexed beneficiary,
        uint256 indexed amountSent,
        uint256 indexed amountReceived
    );

    event SwapRate(
        string indexed exchangeType,
        uint256 indexed sellingAmount,
        uint256 indexed buyingAmount
    );

    function requireHasEnoughToken(
        ERC20 _tokenAddress,
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view {
        require(
            _tokenAddress.balanceOf(_addressToValidate) >= _requiredAmount,
            concatenate("Not enough ", _tokenAddress.symbol())
        );
    }

    function getAvailableTokenAmount(ERC20 _tokenToCheckBalanceOf)
        internal
        view
        returns (uint256)
    {
        return _tokenToCheckBalanceOf.balanceOf(address(this));
    }

    function getSatiTokenAmountForFromRate(uint256 _ERC20TokenAmount)
        internal
        returns (uint256)
    {
        int256 exchangeRate = getScaledRate(precisionDecimals);

        return
            scaleTokenForMultiplication(_ERC20TokenAmount, precisionDecimals) *
            uint256(exchangeRate);
    }

    function getERC20TokenAmountFromRate(uint256 _satiAmount)
        internal
        returns (uint256)
    {
        int256 exchangeRate = getScaledRate(precisionDecimals);

        return
            scaleTokenForDivision(_satiAmount, precisionDecimals) /
            uint256(exchangeRate);
    }
}
