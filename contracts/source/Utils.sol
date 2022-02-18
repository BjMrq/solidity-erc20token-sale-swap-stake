// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

contract Utils {
    function concatenate(string memory partOne, string memory partTwo)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(partOne, partTwo));
    }
}
