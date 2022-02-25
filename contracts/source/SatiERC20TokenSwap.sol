// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./SatiToken.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Swapable.sol";
import "./ISatiSwapable.sol";

// STI: 0x4d89B61B074ffbF8df0C459900c42972164beB34

// BAT: (token: 0x7dad0d1c1a012b8ab5f7c2fb93469440726fe7e5, rate: 0x9441D7556e7820B5ca42082cfa99487D56AcA958)
// LINK: (token: 0xa36085f69e2889c224210f603d836748e7dc0088, rate: 0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0)

// 0x4d89B61B074ffbF8df0C459900c42972164beB34,0xa36085f69e2889c224210f603d836748e7dc0088,0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0

//0x2c400743A8852052c6F26F5a5E0c7CCc6C9d8d42

contract SatiERC20TokenSwap is Context, Swapable {
    SatiToken public satiToken;

    ERC20 public ERC20Token;

    constructor(
        SatiToken _satiToken,
        ERC20 _ERC20Token,
        address _ERC20TokenToUsdRate
    ) Ratable(_ERC20TokenToUsdRate) {
        satiToken = _satiToken;
        ERC20Token = _ERC20Token;
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
        requireHasEnoughToken(ERC20Token, _addressToValidate, _requiredAmount);
    }

    function getAvailableERC20TokenAmount() public view returns (uint256) {
        return getAvailableTokenAmount(ERC20Token);
    }

    function getAvailableSatiTokenAmount() public view returns (uint256) {
        return getAvailableTokenAmount(satiToken);
    }

    //////////////////
    //// Buy Sati ////
    //////////////////

    function getAmountOfSatiFromPairedToken(uint256 _ERC20TokenAmount)
        public
        override
        returns (uint256)
    {
        uint256 tokenAmountToExchange = getSatiTokenAmountForFromRate(
            _ERC20TokenAmount
        );

        emit SwapRate(
            concatenate(ERC20Token.symbol(), " to STI"),
            _ERC20TokenAmount,
            tokenAmountToExchange
        );

        return tokenAmountToExchange;
    }

    function swapPairedTokenForSati(uint256 _ERC20TokenAmount)
        external
        payable
        override
    {
        requireHasEnoughPairedToken(_msgSender(), _ERC20TokenAmount);

        uint256 satiTokenAmount = getAmountOfSatiFromPairedToken(
            _ERC20TokenAmount
        );

        requireHasEnoughSati(address(this), satiTokenAmount);

        ERC20Token.transferFrom(_msgSender(), address(this), _ERC20TokenAmount);
        satiToken.transfer(_msgSender(), satiTokenAmount);

        emit SwapTransfer(_msgSender(), msg.value, satiTokenAmount);
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

        emit SwapRate(
            concatenate("STI to ", ERC20Token.symbol()),
            _satiAmount,
            tokenAmountToExchange
        );

        return tokenAmountToExchange;
    }

    function swapSatiForPairedToken(uint256 _satiAmount)
        external
        payable
        override
    {
        requireHasEnoughSati(_msgSender(), _satiAmount);

        uint256 ERC20TokenAmount = getNumberOfPairedTokenFromSati(_satiAmount);

        requireHasEnoughPairedToken(address(this), ERC20TokenAmount);

        satiToken.transferFrom(_msgSender(), address(this), _satiAmount);
        ERC20Token.transfer(_msgSender(), ERC20TokenAmount);

        emit SwapTransfer(_msgSender(), _satiAmount, ERC20TokenAmount);
    }
}
