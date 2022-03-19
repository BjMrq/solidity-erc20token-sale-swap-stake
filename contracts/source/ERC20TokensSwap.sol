// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./SatiToken.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "./Swapable.sol";
import "./ISwapable.sol";

// STI: 0x4d89B61B074ffbF8df0C459900c42972164beB34

// BAT: (token: 0x7dad0d1c1a012b8ab5f7c2fb93469440726fe7e5, rate: 0x9441D7556e7820B5ca42082cfa99487D56AcA958)
// LINK: (token: 0xa36085f69e2889c224210f603d836748e7dc0088, rate: 0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0)

// 0x4d89B61B074ffbF8df0C459900c42972164beB34,0xa36085f69e2889c224210f603d836748e7dc0088,0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0

//0x2c400743A8852052c6F26F5a5E0c7CCc6C9d8d42

contract ERC20TokensSwap is Context, Swapable {
    ERC20 public quoteToken;
    ERC20 public baseToken;

    constructor(
        ERC20 _baseToken,
        ERC20 _quoteToken,
        address _exchangeRate
    ) Ratable(_exchangeRate) {
        quoteToken = _quoteToken;
        baseToken = _baseToken;
        pairName = concatenateThree(
            baseToken.symbol(),
            "/",
            quoteToken.symbol()
        );
    }

    function requireHasEnoughQuoteToken(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view {
        requireHasEnoughToken(quoteToken, _addressToValidate, _requiredAmount);
    }

    function requireHasEnoughBaseToken(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view {
        requireHasEnoughToken(baseToken, _addressToValidate, _requiredAmount);
    }

    function getAvailableBaseTokenLiquidity() public view returns (uint256) {
        return getAvailableTokenAmount(baseToken);
    }

    function getAvailableQuoteTokenLiquidity() public view returns (uint256) {
        return getAvailableTokenAmount(quoteToken);
    }

    //////////////////////////
    ///// Buy base token /////
    //////////////////////////

    function getBidPrice(uint256 _quoteTokenAmount)
        public
        override
        returns (uint256)
    {
        uint256 baseTokenAmountToExchange = getBaseTokenAmountFromRate(
            _quoteTokenAmount
        );

        emit SwapRateInfo(
            concatenateTwo("Bid ", pairName),
            _quoteTokenAmount,
            baseTokenAmountToExchange
        );

        return baseTokenAmountToExchange;
    }

    function swapQuoteForBaseToken(uint256 _quoteTokenAmount)
        external
        payable
        override
    {
        requireHasEnoughQuoteToken(_msgSender(), _quoteTokenAmount);

        uint256 baseTokenAmount = getBidPrice(_quoteTokenAmount);

        requireHasEnoughBaseToken(address(this), baseTokenAmount);

        quoteToken.transferFrom(_msgSender(), address(this), _quoteTokenAmount);
        baseToken.transfer(_msgSender(), baseTokenAmount);

        emit SwapTransferInfo(_msgSender(), _quoteTokenAmount, baseTokenAmount);
    }

    ///////////////////////////
    ///// Sell base token /////
    ///////////////////////////

    function getAskPrice(uint256 _baseTokenAmount)
        public
        override
        returns (uint256)
    {
        uint256 quoteTokenToExchange = getQuoteTokenAmountForFromRate(
            _baseTokenAmount
        );

        emit SwapRateInfo(
            concatenateTwo("Ask ", pairName),
            _baseTokenAmount,
            quoteTokenToExchange
        );

        return quoteTokenToExchange;
    }

    function swapBaseForQuoteToken(uint256 _baseTokenAmount)
        external
        payable
        override
    {
        requireHasEnoughBaseToken(_msgSender(), _baseTokenAmount);

        uint256 quoteTokenAmount = getAskPrice(_baseTokenAmount);

        requireHasEnoughQuoteToken(address(this), quoteTokenAmount);

        baseToken.transferFrom(_msgSender(), address(this), _baseTokenAmount);
        quoteToken.transfer(_msgSender(), quoteTokenAmount);

        emit SwapTransferInfo(_msgSender(), msg.value, quoteTokenAmount);
    }
}
