## Foundry

### ztm-blockchain developer course

Following the ztm-blockchain developer course. Current functionality:

- ERC20.sol
- ERC20.t.sol (testing ERC20.sol)
- ERC20.s.sol (script to deploy)

> Add test functions to our ERC20 test contract for the transferFrom functionality.
> Write at least one test to check if the balances are as expected.
> Write at least one test to check if a revert happened as expected.
>Then extend our ERC20 contract to mint 100e18 tokens to the msg.sender.
> Now extend our ERC20 deployment script to transfer 25e18 tokens to four pre-defined addresses of your choice after the ERC20 is deployed.
>Deploy + verify the contract to a testnet of your choice and make sure the four addresses received 25 tokens each.


SEPOLIA URL: URL: https://sepolia.etherscan.io/address/0xea5bae90d9a64f8386821a88651164cb037a918f

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**



Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/ERC20.s.sol:ERC20Script --rpc-url ${SEPOLIA_RPC_URL} --verify --broadcast
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
