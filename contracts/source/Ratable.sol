// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Ratable {
    event Rate(int256 price, uint256 timeStamp);

    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeedContract) {
        priceFeed = AggregatorV3Interface(_priceFeedContract);
    }

    function getRate() public returns (int256, uint256) {
        (, int256 price, , uint256 timeStamp, ) = priceFeed.latestRoundData();

        emit Rate(price, timeStamp);

        return (price, timeStamp);
    }
}
