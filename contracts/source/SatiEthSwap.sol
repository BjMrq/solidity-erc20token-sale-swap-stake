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

    function requireHasEnoughPairedToken(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view override {
        require(
            address(_addressToValidate).balance >= _requiredAmount,
            "Not enough ETH"
        );
    }

    //////////////////
    //// Buy Sati ////
    //////////////////

    function getAmountOfSatiFromPairedToken(uint256 _weiAmount)
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

    function swapPairedTokenForSati(uint256 _ERC20TokenAmount)
        external
        payable
        override
    {
        uint256 satiTokenAmount = getAmountOfSatiFromPairedToken(
            _ERC20TokenAmount
        );

        requireHasEnoughSati(address(this), satiTokenAmount);
        requireHasEnoughPairedToken(address(this), _ERC20TokenAmount);

        satiToken.transfer(_msgSender(), satiTokenAmount);

        emit SwapTransfer(_msgSender(), _ERC20TokenAmount, satiTokenAmount);
    }

    ///////////////////
    //// Sell Sati ////
    ///////////////////

    function getNumberOfPairedTokenFromSati(uint256 _satiAmount)
        public
        override
        returns (uint256)
    {
        uint256 tokenAmountToExchange = getERC20TokenAmountFromRate(
            _satiAmount
        );

        emit SwapRate("STI to ETH", _satiAmount, tokenAmountToExchange);

        return tokenAmountToExchange;
    }

    function swapSatiForPairedToken(uint256 _satiTokenAmount)
        external
        payable
        override
    {
        requireHasEnoughSati(_msgSender(), _satiTokenAmount);

        uint256 weiAmount = getNumberOfPairedTokenFromSati(_satiTokenAmount);

        requireHasEnoughPairedToken(address(_msgSender()), weiAmount);

        satiToken.transferFrom(_msgSender(), address(this), _satiTokenAmount);

        emit SwapTransfer(_msgSender(), _satiTokenAmount, weiAmount);
    }
}
