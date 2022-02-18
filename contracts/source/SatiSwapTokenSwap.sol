// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./SatiToken.sol";

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Swapable.sol";
import "./ISatiSwapable.sol";

// TODO use remix review rate exchange value, then review the one for etherium, then write tests

// STI: 0x4d89B61B074ffbF8df0C459900c42972164beB34

// BAT: (token: 0x7dad0d1c1a012b8ab5f7c2fb93469440726fe7e5, rate: 0x9441D7556e7820B5ca42082cfa99487D56AcA958)
// LINK: (token: 0xa36085f69e2889c224210f603d836748e7dc0088, rate: 0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0)

// 0x4d89B61B074ffbF8df0C459900c42972164beB34,0xa36085f69e2889c224210f603d836748e7dc0088,0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0

//0x2c400743A8852052c6F26F5a5E0c7CCc6C9d8d42

contract SatiSwapTokenSwap is Context, Ownable, Swapable {
    SatiToken public satiToken;

    ERC20 public swapToken;

    constructor(
        SatiToken _satiToken,
        ERC20 _swapToken,
        address _swapTokenToUsdRate
    ) Ratable(_swapTokenToUsdRate) {
        satiToken = _satiToken;
        swapToken = _swapToken;
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
        requireHasEnoughToken(satiToken, _addressToValidate, _requiredAmount);
    }

    function getAvailableSwapTokenAmount() public view returns (uint256) {
        return getAvailableTokenAmount(swapToken);
    }

    function getAvailableSatiTokenAmount() public view returns (uint256) {
        return getAvailableTokenAmount(satiToken);
    }

    //////////////////
    //// Buy Sati ////
    //////////////////

    function getAmountOfSatiFromSwapToken(uint256 _swapTokenAmount)
        public
        override
        returns (uint256)
    {
        uint256 tokenAmountToExchange = getSatiTokenAmountForFromRate(
            _swapTokenAmount
        );

        emit SwapRate(
            concatenate(swapToken.symbol(), " to STI"),
            _swapTokenAmount,
            tokenAmountToExchange
        );

        return tokenAmountToExchange;
    }

    function swapSwapTokenForSati(uint256 _swapTokenAmount)
        external
        payable
        override
    {
        requireHasEnoughSwapToken(_msgSender(), _swapTokenAmount);

        uint256 satiTokenAmount = getAmountOfSatiFromSwapToken(
            _swapTokenAmount
        );

        requireHasEnoughSati(address(this), satiTokenAmount);

        swapToken.transferFrom(_msgSender(), address(this), _swapTokenAmount);
        satiToken.transfer(_msgSender(), satiTokenAmount);

        emit SwapTransfer(_msgSender(), msg.value, satiTokenAmount);
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

        emit SwapRate(
            concatenate("STI to ", swapToken.symbol()),
            _satiAmount,
            tokenAmountToExchange
        );

        return tokenAmountToExchange;
    }

    function swapSatiForSwapToken(uint256 _satiAmount)
        external
        payable
        override
    {
        requireHasEnoughSati(_msgSender(), _satiAmount);

        uint256 swapTokenAmount = getNumberOfSwapTokenFromSati(_satiAmount);

        requireHasEnoughSwapToken(address(this), swapTokenAmount);

        satiToken.transferFrom(_msgSender(), address(this), _satiAmount);
        swapToken.transfer(_msgSender(), swapTokenAmount);

        emit SwapTransfer(_msgSender(), _satiAmount, swapTokenAmount);
    }
}
