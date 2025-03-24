import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("ERC20", function () {

    async function deployAndMockERC20() {
        const [alice, bob, craig] = await ethers.getSigners();

        const ERC20Factory = await ethers.getContractFactory("ERC20Mock");
        const erc20token = await ERC20Factory.deploy("MyToken", "SYM", 18);

        // Mint tokens to Alice
        await erc20token.mint(alice.address, 1000);

        return { alice, bob, erc20token, craig };
    }

    it("should transfer tokens between accounts", async function () {
        const { alice, bob, erc20token } = await loadFixture(deployAndMockERC20);
        console.log("Alice balance:", (await erc20token.balanceOf(alice.address)).toString());

        // Verify initial balances
        expect(await erc20token.balanceOf(alice.address)).to.equal(1000n);
        expect(await erc20token.balanceOf(bob.address)).to.equal(0n);

        // Test first transfer with changeTokenBalances matcher
        await expect(
            await erc20token.connect(alice).transfer(bob.address, 100)
        ).to.changeTokenBalances(erc20token, [alice, bob], [-100, 100]);

        // Test second transfer with changeTokenBalances matcher
        await expect(
            await erc20token.connect(bob).transfer(alice.address, 50)
        ).to.changeTokenBalances(erc20token, [alice, bob], [50, -50]);
    });

    it.only("should revert if sender has insufficient balance", async function () {
        const { alice, bob, erc20token } = await loadFixture(deployAndMockERC20);

        // Attempt to transfer more than balance
        await expect(
            erc20token.connect(alice).transfer(bob.address, 3000)
        ).to.be.revertedWith("ERC20: Insufficient sender balance");
    });

    it("should emit Transfer event on transfers", async function () {
        const { alice, bob, erc20token } = await loadFixture(deployAndMockERC20);

        // Mint tokens to Alice
        await erc20token.mint(alice.address, 500);

        // Check if Transfer event is emitted
        await expect(erc20token.connect(alice).transfer(bob.address, 200))
            .to.emit(erc20token, "Transfer")
            .withArgs(alice.address, bob.address, 200);
    });

    it("should transferFrom tokens between accounts", async function () {
        const { alice, bob, erc20token, craig } = await loadFixture(deployAndMockERC20);


        // Approve Bob to spend Alice's tokens
        await erc20token.connect(alice).approve(craig.address, 200);

        // Verify initial balances
        expect(await erc20token.balanceOf(alice.address)).to.equal(1000n);
        expect(await erc20token.balanceOf(bob.address)).to.equal(0n);

        // Test transferFrom with changeTokenBalances matcher
        await expect(
            await erc20token.connect(craig).transferFrom(alice.address, bob.address, 200)
        ).to.changeTokenBalances(erc20token, [alice, bob], [-200, 200]);
    });

    it("should revert if insufficient funds", async function () {
        const { alice, bob, erc20token, craig } = await loadFixture(deployAndMockERC20);


        // Approve Bob to spend Alice's tokens
        await erc20token.connect(alice).approve(craig.address, 100);

        // Verify initial balances
        expect(await erc20token.balanceOf(alice.address)).to.equal(1000n);
        expect(await erc20token.balanceOf(bob.address)).to.equal(0n);

        // Test transferFrom with changeTokenBalances matcher
        await expect(
            erc20token.connect(alice).transferFrom(alice.address, bob.address, 3000)
        ).to.be.revertedWith("ERC20: Insufficient allowance");
    });
});