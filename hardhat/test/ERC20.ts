import { ethers } from "hardhat";

describe("ECR20", function () {

    it("should transfer tokens between accounts", async function () {

        const [alice, bob] = await ethers.getSigners();

        const ERC20 = await ethers.getContractFactory("ERC20Mock");
        const erc20token = await ERC20.deploy("MyToken", "SYM", 18);
        await erc20token.mint(alice.address, 1000);
        await erc20token.transfer(bob.address,100);
    });
});