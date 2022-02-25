// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./SatiToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SatiERC20TokenSwap.sol";

contract SatiSwapContractFactory is Ownable {
    string[] public satiSwapPairs;
    mapping(string => address) public deployedSatiSwapContractsRegistry;

    function deployNewSwapContract(
        SatiToken _satiToken,
        ERC20 _ERC20Token,
        address _ERC20TokenToUsdRate
    ) external onlyOwner {
        address deployedSwapContractAddress = address(
            new SatiERC20TokenSwap(
                _satiToken,
                _ERC20Token,
                _ERC20TokenToUsdRate
            )
        );

        string memory deployedPair = _ERC20Token.symbol();

        satiSwapPairs.push(deployedPair);

        deployedSatiSwapContractsRegistry[
            deployedPair
        ] = deployedSwapContractAddress;
    }

    function getAllSwapPairs() external view returns (string[] memory) {
        return satiSwapPairs;
    }
}
