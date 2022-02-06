// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./SatiToken.sol";

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Ratable.sol";

// TODO use remix review rate exchange value, then review the one for etherium, then write tests

// STI: 0x4d89B61B074ffbF8df0C459900c42972164beB34

// BAT: (token: 0x7dad0d1c1a012b8ab5f7c2fb93469440726fe7e5, rate: 0x9441D7556e7820B5ca42082cfa99487D56AcA958)
// LINK: (token: 0xa36085f69e2889c224210f603d836748e7dc0088, rate: 0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0)

// 0x4d89B61B074ffbF8df0C459900c42972164beB34,0xa36085f69e2889c224210f603d836748e7dc0088,0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0

contract SwapTokenSati is Context, Ownable, Ratable {
    SatiToken public satiToken;

    ERC20 public swapToken;

    event SwapTransfer(
        address beneficiary,
        uint256 indexed amountSent,
        uint256 indexed amountReceived
    );

    constructor(
        SatiToken _satiToken,
        ERC20 _swapToken,
        address _swapTokenToUsdRate
    ) Ratable(_swapTokenToUsdRate) {
        satiToken = _satiToken;
        swapToken = _swapToken;
    }

    function requireHasEnoughToken(
        ERC20 _tokenAddress,
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view {
        require(
            _tokenAddress.balanceOf(_addressToValidate) >= _requiredAmount,
            string(abi.encodePacked("not enough ", _tokenAddress.name()))
        );
    }

    function requireHasEnoughSati(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view {
        requireHasEnoughToken(satiToken, _addressToValidate, _requiredAmount);
    }

    function requireHasEnoughSwapToken(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view {
        requireHasEnoughToken(satiToken, _addressToValidate, _requiredAmount);
    }

    function getAvailableTokenAmount(ERC20 _tokenToCheckBalanceOf)
        internal
        view
        returns (uint256)
    {
        return _tokenToCheckBalanceOf.balanceOf(address(this));
    }

    function getSatiTokenAmountFromRate(uint256 _swapTokenAmount)
        public
        returns (uint256)
    {
        int256 exchangeRate = getScaledRate(0);
        return _swapTokenAmount * uint256(exchangeRate);
    }

    function getSwapTokenAmountFromRate(uint256 _satiAmount)
        public
        returns (uint256)
    {
        int256 exchangeRate = getScaledRate(0);
        return _satiAmount / uint256(exchangeRate);
    }

    function getAvailableSwapTokenAmount() public view returns (uint256) {
        return getAvailableTokenAmount(swapToken);
    }

    function getAvailableSatiTokenAmount() public view returns (uint256) {
        return getAvailableTokenAmount(satiToken);
    }

    function exchangeSatiForSwapToken(uint256 _satiTokenAmount)
        external
        payable
    {
        requireHasEnoughSati(_msgSender(), _satiTokenAmount);

        uint256 swapTokenAmount = getSwapTokenAmountFromRate(_satiTokenAmount);

        requireHasEnoughSwapToken(address(this), swapTokenAmount);

        satiToken.transferFrom(_msgSender(), address(this), _satiTokenAmount);
        swapToken.transfer(_msgSender(), swapTokenAmount);

        emit SwapTransfer(_msgSender(), _satiTokenAmount, swapTokenAmount);
    }

    function exchangeSwapTokenForSati(uint256 _swapTokenAmount)
        external
        payable
    {
        requireHasEnoughSwapToken(_msgSender(), _swapTokenAmount);

        uint256 satiTokenAmount = getSatiTokenAmountFromRate(_swapTokenAmount);

        requireHasEnoughSati(address(this), satiTokenAmount);

        swapToken.transferFrom(_msgSender(), address(this), _swapTokenAmount);
        satiToken.transfer(_msgSender(), satiTokenAmount);

        emit SwapTransfer(_msgSender(), msg.value, satiTokenAmount);
    }
}
