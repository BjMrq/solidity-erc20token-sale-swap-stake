// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./SatiToken.sol";

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Ratable.sol";

contract SatiEthSwap is Context, Ownable, Ratable {
    SatiToken public satiToken;

    event SwapTransfer(
        string swapName,
        address beneficiary,
        uint256 amountSent,
        uint256 amountReceived
    );

    constructor(SatiToken _satiToken)
        Ratable(0x9326BFA02ADD2366b30bacB125260Af641031331)
    {
        satiToken = _satiToken;
    }

    function requireHasEnoughSati(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view {
        require(
            satiToken.balanceOf(_addressToValidate) >= _requiredAmount,
            "not enough Sati available"
        );
    }

    function requireHasEnoughEther(
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view {
        require(
            address(_addressToValidate).balance >= _requiredAmount,
            "not enough Ether available"
        );
    }

    function getSatiTokenAmountFromRate(uint256 _weiAmount)
        internal
        returns (uint256)
    {
        (int256 exchangeRate, ) = getRate();
        return _weiAmount * uint256(exchangeRate);
    }

    function getEthTokenAmountFromRate(uint256 _satiAmount)
        internal
        returns (uint256)
    {
        (int256 exchangeRate, ) = getRate();
        return _satiAmount / uint256(exchangeRate);
    }

    function swapSatiForEth(uint256 _satiTokenAmount) external payable {
        requireHasEnoughSati(_msgSender(), _satiTokenAmount);

        uint256 weiAmount = getEthTokenAmountFromRate(_satiTokenAmount);

        requireHasEnoughEther(address(_msgSender()), weiAmount);

        satiToken.transferFrom(_msgSender(), address(this), _satiTokenAmount);

        emit SwapTransfer(
            "Sati to Eth",
            _msgSender(),
            _satiTokenAmount,
            weiAmount
        );
    }

    function swapEthForSati() external payable {
        uint256 satiTokenAmount = getSatiTokenAmountFromRate(msg.value);

        requireHasEnoughSati(address(this), satiTokenAmount);
        requireHasEnoughEther(address(this), msg.value);

        satiToken.transfer(_msgSender(), satiTokenAmount);

        emit SwapTransfer(
            "Eth to Sati",
            _msgSender(),
            msg.value,
            satiTokenAmount
        );
    }
}
