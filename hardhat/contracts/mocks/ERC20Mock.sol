// SPDX-Liensce-Identifier: MIT

pragma solidity ^0.8.28;

import {ERC20} from "../ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) ERC20(_name, _symbol, _decimals) {}

    function mint(address to, uint256 value) external {
        _mint(to, value);
    }
}
