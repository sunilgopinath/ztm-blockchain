# ZTM Hardhat Project

## Getting Started

```sh
$> npm install --global hardhat-shorthand
```

## Running Tests

```sh
❯ hh test


  ECR20
    ✔ should transfer tokens between accounts (402ms)


  1 passing (405ms)
```

### Mocks

In order to run the tests we are utilzing mock testing which requires the deployment of a mock contract /contracts/mocks/ERC20Mock.sol

## Deploying the contract

```sh
$> hh ignition deploy ./ignition/modules/ERC20.ts --network sepolia
> ✔ Confirm deploy to network sepolia (11155111)? … yes
Hardhat Ignition 🚀

Deploying [ ERC20Module ]

Batch #1
  Executed ERC20Module#ERC20

[ ERC20Module ] successfully deployed 🚀

Deployed Addresses

ERC20Module#ERC20 - 0x3408c075751172805ff6cCEcb830E2A1780C7C93
```

### Set Environment variables

```sh
$> hh vars set PRIVATE_KEY
$> hh vars set ETHERSCAN_API_KEY
$> hh vars set SEPOLIA_RPC_URL
```

### Verify

```sh
$> hh verify --network sepolia 0x3408c075751172805ff6cCEcb830E2A1780C7C93 MyToken SYM 18
[INFO] Sourcify Verification Skipped: Sourcify verification is currently disabled. To enable it, add the following entry to your Hardhat configuration:

sourcify: {
  enabled: true
}

Or set 'enabled' to false to hide this message.

For more information, visit https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#verifying-on-sourcify
Successfully submitted source code for contract
contracts/ERC20.sol:ERC20 at 0x3408c075751172805ff6cCEcb830E2A1780C7C93
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ERC20 on the block explorer.
https://sepolia.etherscan.io/address/0x3408c075751172805ff6cCEcb830E2A1780C7C93#code
```