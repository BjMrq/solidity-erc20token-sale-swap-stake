// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./SatiToken.sol";

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Swapable.sol";
import "./ISatiSwapable.sol";

contract SatiEthSwap is Context, Ownable, Swapable {
    SatiToken public satiToken;

    constructor(SatiToken _satiToken, address _ethToUsdRate)
        Ratable(_ethToUsdRate)
    {
        satiToken = _satiToken;
    }

    function requireHasEnoughSati(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view override {
        requireHasEnoughToken(satiToken, _addressToValidate, _requiredAmount);
    }

    function requireHasEnoughSwapToken(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view override {
        require(
            address(_addressToValidate).balance >= _requiredAmount,
            "not enough ETH"
        );
    }

    //////////////////
    //// Buy Sati ////
    //////////////////

    function getAmountOfSatiFromSwapToken(uint256 _weiAmount)
        public
        override
        returns (uint256)
    {
        uint256 tokenAmountToExchange = getSatiTokenAmountForFromRate(
            _weiAmount
        );

        emit SwapRate("ETH to STI", _weiAmount, tokenAmountToExchange);

        return tokenAmountToExchange;
    }

    function swapSwapTokenForSati(uint256 _swapTokenAmount)
        external
        payable
        override
    {
        uint256 satiTokenAmount = getAmountOfSatiFromSwapToken(
            _swapTokenAmount
        );

        requireHasEnoughSati(address(this), satiTokenAmount);
        requireHasEnoughSwapToken(address(this), _swapTokenAmount);

        satiToken.transfer(_msgSender(), satiTokenAmount);

        emit SwapTransfer(_msgSender(), _swapTokenAmount, satiTokenAmount);
    }

    ///////////////////
    //// Sell Sati ////
    ///////////////////

    function getNumberOfSwapTokenFromSati(uint256 _satiAmount)
        public
        override
        returns (uint256)
    {
        uint256 tokenAmountToExchange = getSwapTokenAmountFromRate(_satiAmount);

        emit SwapRate("STI to ETH", _satiAmount, tokenAmountToExchange);

        return tokenAmountToExchange;
    }

    function swapSatiForSwapToken(uint256 _satiTokenAmount)
        external
        payable
        override
    {
        requireHasEnoughSati(_msgSender(), _satiTokenAmount);

        uint256 weiAmount = getNumberOfSwapTokenFromSati(_satiTokenAmount);

        requireHasEnoughSwapToken(address(_msgSender()), weiAmount);

        satiToken.transferFrom(_msgSender(), address(this), _satiTokenAmount);

        emit SwapTransfer(_msgSender(), _satiTokenAmount, weiAmount);
    }
}
