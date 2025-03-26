import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("ERC20", function () {

    async function deployAndMockERC20() {
        const [deployer, alice, bob, craig] = await ethers.getSigners();

        const ERC20Factory = await ethers.getContractFactory("ERC20Mock");
        const erc20token = await ERC20Factory.deploy("MyToken", "SYM", 18);

        // Mint tokens to Alice
        await erc20token.mint(alice.address, ethers.parseEther("1000"));

        return { alice, bob, erc20token, craig };
    }

    it("should transfer tokens between accounts", async function () {
        const { alice, bob, erc20token } = await loadFixture(deployAndMockERC20);

        await erc20token.connect(alice).transfer(bob.address, ethers.parseEther("100"));

        const aliceBal = await erc20token.balanceOf(alice.address);
        const bobBal = await erc20token.balanceOf(bob.address);

        console.log("Alice balance:", aliceBal.toString());
        console.log("Bob balance:", bobBal.toString());

        expect(aliceBal).to.equal(ethers.parseEther("900"));
        expect(bobBal).to.equal(ethers.parseEther("100"));
    });

    it("should revert if sender has insufficient balance", async function () {
        const { alice, bob, erc20token } = await loadFixture(deployAndMockERC20);

        await erc20token.mint(alice.address, ethers.parseEther("1000"));

        await expect(
            erc20token.connect(alice).transfer(bob.address, ethers.parseEther("3000"))
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
        await erc20token.connect(alice).approve(craig.address, ethers.parseEther("200"));

        // Verify initial balances
        expect(await erc20token.balanceOf(alice.address)).to.equal(ethers.parseEther("1000"));
        expect(await erc20token.balanceOf(bob.address)).to.equal(ethers.parseEther("0"));

        // Test transferFrom with changeTokenBalances matcher
        await expect(
            await erc20token.connect(craig).transferFrom(alice.address, bob.address, ethers.parseEther("200"))
        ).to.changeTokenBalances(erc20token, [alice, bob], [ethers.parseEther("-200"), ethers.parseEther("200")]);
    });

    it("should revert if insufficient funds", async function () {
        const { alice, bob, erc20token, craig } = await loadFixture(deployAndMockERC20);


        // Approve Bob to spend Alice's tokens
        await erc20token.connect(alice).approve(craig.address, ethers.parseEther("100"));

        // Verify initial balances
        expect(await erc20token.balanceOf(alice.address)).to.equal(ethers.parseEther("1000"));
        expect(await erc20token.balanceOf(bob.address)).to.equal(ethers.parseEther("0"));

        // Test transferFrom with changeTokenBalances matcher
        await expect(
            erc20token.connect(alice).transferFrom(alice.address, bob.address, ethers.parseEther("3000"))
        ).to.be.revertedWith("ERC20: Insufficient allowance");
    });
});

