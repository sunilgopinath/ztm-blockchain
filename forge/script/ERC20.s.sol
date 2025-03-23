// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {ERC20} from "../src/ERC20.sol";

contract ERC20Script is Script {
    function setUp() public {}

    function run() public {
        uint256 key = vm.envUint("PRIVATE_KEY");

        address addr1 = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        address addr2 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        address addr3 = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        address addr4 = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;

        vm.startBroadcast(key);
        ERC20 tokenContract = new ERC20("MyToken", "SYM", 18);

        tokenContract.mint();
        tokenContract.transfer(addr1, 25e18);
        tokenContract.transfer(addr2, 25e18);
        tokenContract.transfer(addr3, 25e18);
        tokenContract.transfer(addr4, 25e18);

        vm.stopBroadcast();
    }
}
