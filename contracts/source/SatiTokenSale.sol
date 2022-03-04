// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "./Crowdsale.sol";
import "./KYCValidation.sol";
import "./Ratable.sol";

contract SatiTokenSale is Crowdsale {
    KYCValidation kycValidation;

    constructor(
        uint256 _fixedExchangeRate,
        address payable _wallet,
        IERC20 _token,
        KYCValidation _kycValidation
    ) Crowdsale(_fixedExchangeRate, _wallet, _token) {
        kycValidation = _kycValidation;
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

    function _preValidatePurchase(address _buyer, uint256 _weiAmount)
        internal
        view
        override
    {
        requireHasEnoughEther(_buyer, _weiAmount);
        super._preValidatePurchase(_buyer, _weiAmount);

        // Deactivated for demo
        // kycValidation.requireKYCCompletion(_buyer);
    }
}
