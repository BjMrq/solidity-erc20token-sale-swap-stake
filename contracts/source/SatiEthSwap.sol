// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./SatiToken.sol";

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SatiEthSwap is Context, Ownable {
    SatiToken public satiToken;
    uint8 public ethToSatiRate = 100;

    event EthSatiRateChange(
        uint8 oldEthToSatiRate,
        string changeDirection,
        uint8 newEthToSatiRate
    );

    constructor(SatiToken _satiToken) {
        satiToken = _satiToken;
    }

    function setEthToSatiRate(uint8 _rateToSet) public onlyOwner {
        emit EthSatiRateChange(ethToSatiRate, "to", _rateToSet);
        ethToSatiRate = _rateToSet;
    }

    function swapEthForSati() external payable {
        uint256 satiTokenAmount = msg.value * ethToSatiRate;
        satiToken.transfer(_msgSender(), satiTokenAmount);
    }
}
