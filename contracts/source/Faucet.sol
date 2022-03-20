// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract Faucet {
    mapping(address => uint256) public lockTime;

    uint64 faucetDistribution = 0.01 ether;

    event Request(address _beneficiary, uint256 _balance);

    function makeItRain() external payable {
        require(
            block.timestamp > lockTime[msg.sender],
            "Lock time has not expired, please try again later"
        );
        // require(
        //     _beneficiary.balance <= 0.2 ether,
        //     "You already have enough ether to play around with"
        // );
        require(
            address(this).balance >= faucetDistribution,
            "Faucet is dry, consider sending some ether to it"
        );

        payable(msg.sender).transfer(faucetDistribution);

        lockTime[msg.sender] = block.timestamp + 1 days;
    }

    receive() external payable {}
}
