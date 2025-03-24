// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ERC20Module = buildModule("ERC20Module", (m) => {
  const name = "MyToken";
  const symbol = "SYM";
  const decimals = 18;

  const addr1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const addr2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const addr3 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  const addr4 = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

  // First, deploy the ERC20 contract
  const erc20 = m.contract("ERC20Mock", [name, symbol, decimals]);

  // Mint tokens to the deployer first so you can transfer them
  const deployer = m.getAccount(0);
  const mintAmount = "100000000000000000000"; // 100 tokens with 18 decimals
  m.call(erc20, "mint", [deployer, mintAmount], { id: "minttodeployer" });

  // The amount to transfer - 25e18 (25 tokens with 18 decimals)
  const transferAmount = "25000000000000000000";

  // Transfer with unique IDs for each call
  m.call(erc20, "transfer", [addr1, transferAmount], { id: "transfertoaddr1" });
  m.call(erc20, "transfer", [addr2, transferAmount], { id: "transfertoaddr2" });
  m.call(erc20, "transfer", [addr3, transferAmount], { id: "transfertoaddr3" });
  m.call(erc20, "transfer", [addr4, transferAmount], { id: "transfertoaddr4" });

  return { erc20 };
});

export default ERC20Module;