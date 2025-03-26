# 🪙 ETH-Backed Stablecoin System

This project implements a simple, fully on-chain ETH-backed stablecoin system using Solidity. It features dynamic minting and burning, protocol-level collateral buffer support, and a fee mechanism — all powered by a fixed-point arithmetic library and a mock oracle.

---

## 📦 Contracts

### `Stablecoin.sol`
An ERC-20 compliant stablecoin contract (STC) that allows users to:
- **Mint** STC by depositing ETH at the oracle-defined price (minus a configurable fee).
- **Burn** STC to redeem ETH based on the current oracle price (also minus a fee).
- **Deposit ETH** as surplus collateral and receive `DepositorCoin` (DPC) tokens.
- **Withdraw** ETH from the surplus buffer by burning DPC, subject to a time lock and availability.

### `DepositorCoin.sol`
A secondary ERC-20 token representing ownership of surplus ETH in the system. Users receive DPC when they deposit more ETH than needed to cover system liabilities and can later redeem it.

### `Oracle.sol`
A mock price oracle that allows manual setting of the ETH/USD price. In a production environment, this would be replaced by Chainlink or another decentralized oracle provider.

### `FixedPoint.sol`
A lightweight fixed-point math library for accurate token issuance and pricing calculations using 18-decimal precision.

---

## ⚙️ System Mechanics

### 🔄 Minting
Users can mint STC by sending ETH to the contract. The amount minted is:

```solidity
(STC minted) = (ETH sent - fee) * oracle price
```

### 🔥 Burning
Users can burn their STC to withdraw ETH from the contract. The amount of ETH received is:

```solidity
(ETH refunded) = (STC burned / oracle price) - fee
```


### 💰 Collateral Buffer
- Users can deposit ETH into the system when it is under-collateralized or to add surplus.
- If the system has a **surplus**, the user receives DPC tokens in return.
- If the system is **under-collateralized**, the user must restore the deficit **plus** meet an initial collateral ratio to receive DPC.

### 🔐 Withdrawing Buffer
- DPC holders can burn tokens to withdraw ETH **only if there is a surplus**.
- Withdrawals are locked until the configured `unlockTime` has passed (default: 1 day).

---

## ✅ Features Covered by Tests

- ✅ Minting and burning of STC
- ✅ Fee logic on both mint and burn
- ✅ Oracle-driven price mechanics
- ✅ Collateral deficit/surplus handling
- ✅ DepositorCoin issuance and redemption
- ✅ Time-locked collateral buffer withdrawals
- ✅ Robust reverts for edge cases and misuse

---

## 🧪 Testing

The project includes a full Hardhat test suite written in TypeScript using:
- `chai` for assertions
- `ethers.js` v6
- `@nomicfoundation/hardhat-network-helpers` for fixture setup and time manipulation

Run tests with:
```bash
npx hardhat test
```

## 🛠️ To Do
- Integrate a live oracle like Chainlink
- Add a frontend to interact with the stablecoin system
- Enhance support for multiple collateral types
- Add automated collateral ratio rebalancing logic

## 🧠 Learning Goals
- This project was designed to deepen understanding of:
- Custom ERC20 token systems
- Fixed-point arithmetic in Solidity
- Smart contract fee models
- Protocol-level collateralization
- Solidity test-driven development with Hardhat + TypeScript