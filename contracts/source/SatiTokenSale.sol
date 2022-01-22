// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "./Crowdsale.sol";
import "./KYCValidation.sol";

contract SatiTokenSale is Crowdsale {
    KYCValidation kycValidation;

    constructor(
        uint256 _rate,
        address payable _wallet,
        IERC20 _token,
        KYCValidation _kycValidation
    ) Crowdsale(_rate, _wallet, _token) {
        kycValidation = _kycValidation;
    }

    function _preValidatePurchase(address _buyer, uint256 _weiAmount)
        internal
        view
        override
    {
        super._preValidatePurchase(_buyer, _weiAmount);
        kycValidation.requireKYCCompletion(_buyer);
    }
}
