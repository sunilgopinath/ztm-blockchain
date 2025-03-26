// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console2, StdCheats} from "forge-std/Test.sol";
import {ERC20} from "../contracts/ERC20.sol";
import {DepositorCoin} from "../contracts/DepositorCoin.sol";
import {Oracle} from "../contracts/Oracle.sol";
import {Stablecoin} from "../contracts/StableCoin.sol";

contract StablecoinTest is Test {
    address internal alice;
    address internal bob;
    address internal owner;

    Stablecoin internal stablecoin;
    DepositorCoin internal depositorCoin;
    Oracle internal oracle;

    uint256 internal initialPrice = 2000; // Mock price: 1 ETH = 2000 USD
    uint256 internal feeRate = 1; // 1% fee
    uint256 internal collateralRatio = 150; // 150% collateral ratio
    uint256 internal lockTime = 1 days;

    function setUp() public {
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        owner = address(this);

        oracle = new Oracle();
        oracle.setPrice(initialPrice);

        stablecoin = new Stablecoin(
            "Stablecoin",
            "STC",
            oracle,
            feeRate,
            collateralRatio,
            lockTime
        );

        // Give Alice and Bob some initial ETH for testing
        vm.deal(alice, 10 ether);
        vm.deal(bob, 5 ether);
    }

    function testMintStablecoin() public {
        vm.prank(alice);
        stablecoin.mint{value: 1 ether}();

        uint256 expectedMintAmount = (1 ether *
            initialPrice *
            (100 - feeRate)) / 100;
        assertEq(stablecoin.balanceOf(alice), expectedMintAmount);
    }

    function testCannotMintWithoutETH() public {
        vm.prank(alice);
        vm.expectRevert();
        stablecoin.mint{value: 0}();
    }

    function testBurnStablecoin() public {
        vm.startPrank(alice);
        stablecoin.mint{value: 1 ether}();

        uint256 burnAmount = stablecoin.balanceOf(alice);
        stablecoin.burn(burnAmount);

        assertEq(stablecoin.balanceOf(alice), 0);
    }

    function testCannotBurnMoreThanBalance() public {
        vm.prank(alice);
        vm.expectRevert();
        stablecoin.burn(1000 ether);
    }

    function testOracleUpdatesPrice() public {
        oracle.setPrice(2500);
        assertEq(oracle.getPrice(), 2500);
    }

    function testDepositCollateralBuffer() public {
        vm.prank(alice);
        stablecoin.depositCollateralBuffer{value: 1 ether}();

        // Check DepositorCoin is created and Alice received DPC tokens
        DepositorCoin dpc = stablecoin.depositorCoin();
        assertGt(dpc.balanceOf(alice), 0);
    }

    function testWithdrawCollateralBuffer() public {
        vm.startPrank(alice);
        // Create surplus:
        stablecoin.depositCollateralBuffer{value: 2 ether}();
        // Mint some stablecoins (reduces but doesn't eliminate surplus)
        stablecoin.mint{value: 0.5 ether}();

        DepositorCoin dpc = stablecoin.depositorCoin();
        uint256 burnAmount = dpc.balanceOf(alice);

        // Warp forward to unlock DPC
        vm.warp(block.timestamp + 2 days);
        stablecoin.withdrawCollateralBuffer(burnAmount);

        assertEq(dpc.balanceOf(alice), 0);
    }
}
