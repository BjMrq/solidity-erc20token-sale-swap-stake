// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "./SatiToken.sol";
import "./Utils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20TokensSwap.sol";

contract SwapContractFactory is Ownable, Utils {
    struct SwapCAndTokenAddresses {
        address swapContractAddress;
        address quoteTokenAddress;
        address baseTokenAddress;
    }

    string[] public swapPairs;
    mapping(string => SwapCAndTokenAddresses)
        public deployedSwapContractsRegistry;

    function deployNewSwapContract(
        ERC20 _baseToken,
        ERC20 _quoteToken,
        address _exchangeRate
    ) external onlyOwner {
        ERC20TokensSwap swapContract = new ERC20TokensSwap(
            _baseToken,
            _quoteToken,
            _exchangeRate
        );

        string memory deployedPair = swapContract.pairName();

        swapPairs.push(deployedPair);

        deployedSwapContractsRegistry[deployedPair] = SwapCAndTokenAddresses({
            swapContractAddress: address(swapContract),
            quoteTokenAddress: address(_quoteToken),
            baseTokenAddress: address(_baseToken)
        });
    }

    function getAllSwapPairs() external view returns (string[] memory) {
        return swapPairs;
    }
}
