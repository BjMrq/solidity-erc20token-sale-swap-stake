// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

contract Faucet {
    mapping(address => uint256) public lockTime;

    uint64 faucetDistribution = 0.01 ether;

    event Request(address _beneficiary, uint256 _balance);

    function makeItRain(address payable _beneficiary) external payable {
        emit Request(_beneficiary, _beneficiary.balance);

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

        _beneficiary.transfer(faucetDistribution);

        lockTime[msg.sender] = block.timestamp + 1 days;
    }

    receive() external payable {}
}