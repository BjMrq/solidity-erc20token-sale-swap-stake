// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SatiToken is ERC20 {
    constructor(uint256 _initialSupply) ERC20("Sati", "STI") {
        _mint(msg.sender, _initialSupply);
    }
}
