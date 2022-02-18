// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";

contract MockERC20Token is ERC20PresetFixedSupply {
    constructor(uint256 _initialSupply, address _owner)
        ERC20PresetFixedSupply("Mock ERC20", "ERC20", _initialSupply, _owner)
    {}
}
