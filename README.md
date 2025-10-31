# HushYield

A next-generation DeFi staking protocol that combines high-yield ETH staking with privacy-preserving technology. Built with FHEVM (Fully Homomorphic Encryption Virtual Machine) from Zama, HushYield offers users the ability to stake ETH and earn confidential rewards while maintaining complete privacy and security.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Advantages](#advantages)
- [Technologies Used](#technologies-used)
- [Problems We Solve](#problems-we-solve)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Running Tests](#running-tests)
  - [Deploying Contracts](#deploying-contracts)
  - [Running the Frontend](#running-the-frontend)
- [Smart Contracts](#smart-contracts)
- [Security Features](#security-features)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

HushYield is a decentralized staking platform that allows users to stake ETH and earn cETH (Confidential Ether) rewards at a predictable rate of **1 cETH per 1 ETH staked per day**. Unlike traditional staking protocols, HushYield leverages FHEVM technology to enable privacy-preserving smart contracts, ensuring that user balances and transaction details can remain confidential while still being verifiable on-chain.

The protocol features:
- No lock-up periods
- Real-time interest accrual
- Instant withdrawals
- Transparent and auditable smart contracts
- Modern, user-friendly interface

## Key Features

### 1. **Flexible Staking**
- Stake any amount of ETH without minimum requirements
- No lock-up periods - withdraw your funds anytime
- Continuous interest accrual calculated per second
- Multiple deposits and withdrawals supported

### 2. **Predictable Returns**
- Fixed rate: 1 cETH per 1 ETH staked per day
- Interest accrues every second based on your stake
- Transparent calculation visible on-chain
- Claim rewards at any time without penalties

### 3. **Privacy-Preserving Technology**
- Built on FHEVM for future confidential transactions
- Integration with Zama's fully homomorphic encryption
- Enables private balance queries and transactions
- Maintains auditability while preserving privacy

### 4. **User-Friendly Interface**
- Modern React-based frontend
- Seamless wallet integration via RainbowKit
- Real-time balance updates
- Mobile-responsive design
- Clear transaction feedback

### 5. **Security First**
- Reentrancy protection on all state-changing functions
- Comprehensive test coverage
- Auditable smart contract code
- Industry-standard security patterns

## Advantages

### For Users

1. **No Lock-up Constraints**
   - Access your funds immediately without waiting periods
   - Flexibility to enter and exit positions at will
   - No penalty fees for early withdrawal

2. **Transparent Rewards**
   - Clear, predictable yield calculation
   - Real-time visibility of accrued interest
   - No hidden fees or complex formulas

3. **Privacy Options**
   - Future support for confidential balances via FHEVM
   - Maintain financial privacy while using DeFi
   - Encrypted transaction amounts when needed

4. **Gas Efficient**
   - Optimized smart contracts reduce transaction costs
   - Batch operations where possible
   - Minimal on-chain storage requirements

### For Developers

1. **FHEVM Integration**
   - Learn and experiment with cutting-edge encryption technology
   - Template for building privacy-preserving dApps
   - Access to Zama's FHEVM ecosystem

2. **Modern Tech Stack**
   - TypeScript throughout for type safety
   - React 19 with latest features
   - Hardhat for comprehensive testing and deployment
   - Industry-standard tooling and libraries

3. **Well-Documented**
   - Clear code structure and comments
   - Comprehensive test suite
   - Deployment scripts and examples

## Technologies Used

### Smart Contracts
- **Solidity 0.8.27** - Latest Solidity version with enhanced security features
- **FHEVM (Zama)** - Fully Homomorphic Encryption for confidential smart contracts
  - `@fhevm/solidity` - FHEVM Solidity library
  - `@openzeppelin/confidential-contracts` - OpenZeppelin's confidential contract extensions
- **Hardhat** - Ethereum development environment
  - Testing, deployment, and task automation
  - TypeChain for type-safe contract interactions
- **OpenZeppelin Contracts** - Battle-tested smart contract libraries

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript 5.8** - Type-safe JavaScript for robust code
- **Vite 7** - Lightning-fast build tool and dev server
- **Wagmi 2.17** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum interface
- **RainbowKit 2.2** - Best-in-class wallet connection UI
- **TanStack Query** - Powerful data synchronization
- **Ethers.js 6** - Ethereum JavaScript library

### Development Tools
- **Hardhat Deploy** - Deployment management
- **Hardhat Gas Reporter** - Gas usage analysis
- **Solidity Coverage** - Test coverage reporting
- **TypeChain** - TypeScript bindings for contracts
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Mocha & Chai** - Testing framework

### Infrastructure
- **Ethereum Sepolia** - Testnet deployment
- **Infura** - Ethereum node infrastructure
- **Etherscan** - Contract verification

## Problems We Solve

### 1. **Lack of Privacy in DeFi**

**Problem**: Traditional DeFi protocols expose all transaction details publicly, including balances, transfer amounts, and trading patterns. This transparency, while good for auditability, creates privacy concerns for users who don't want their financial activities to be publicly visible.

**HushYield Solution**: By integrating FHEVM technology, HushYield provides a foundation for privacy-preserving DeFi operations. Future iterations will support encrypted balances and confidential transactions, allowing users to stake and earn rewards without exposing their portfolio size or activity patterns.

### 2. **Inflexible Staking Requirements**

**Problem**: Many staking protocols impose lock-up periods ranging from days to years, preventing users from accessing their funds when needed. Others require minimum stake amounts that exclude smaller investors.

**HushYield Solution**: Offers completely flexible staking with:
- Zero lock-up period
- Instant withdrawals at any time
- No minimum or maximum stake requirements
- Pro-rata interest calculation ensures fair rewards regardless of timing

### 3. **Opaque Yield Calculations**

**Problem**: Many DeFi protocols use complex, opaque formulas for calculating returns, making it difficult for users to predict earnings or verify they're receiving fair rewards.

**HushYield Solution**: Implements a simple, transparent formula:
```
Interest = (Staked Amount × Time in Days) × 1 cETH per ETH per day
```
Users can independently verify their interest accrual at any time, and the calculation is performed on-chain with full transparency.

### 4. **High Barrier to Entry for Privacy Tech**

**Problem**: Privacy-preserving technologies like ZK-proofs and FHE are complex and difficult for developers to implement correctly, limiting adoption of privacy features in DeFi.

**HushYield Solution**: Provides a working template and reference implementation for integrating FHEVM into DeFi applications, lowering the barrier for other developers to build privacy-preserving financial products.

### 5. **Security Vulnerabilities**

**Problem**: Many DeFi protocols suffer from common vulnerabilities like reentrancy attacks, overflow/underflow issues, and improper access control.

**HushYield Solution**: Implements comprehensive security measures:
- Reentrancy guards on all critical functions
- Use of Solidity 0.8+ with built-in overflow protection
- Minimal external dependencies to reduce attack surface
- Comprehensive test suite covering edge cases
- Follows OpenZeppelin security standards

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                        │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │  React UI  │  │  RainbowKit  │  │  Wagmi/Viem Hooks  │ │
│  └────────────┘  └──────────────┘  └─────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Web3 Provider
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Smart Contract Layer                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              HashYield Contract                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │  Staking │  │ Interest │  │  Withdrawal      │  │   │
│  │  │  Logic   │  │ Accrual  │  │  Management      │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │          HashYieldToken (cETH) Contract             │   │
│  │  - ERC20 Token                                      │   │
│  │  - Mintable only by HashYield contract              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ (Future Integration)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    FHEVM Layer (Zama)                        │
│  - Fully Homomorphic Encryption                              │
│  - Confidential smart contract execution                     │
│  - Private balance queries                                   │
└─────────────────────────────────────────────────────────────┘
```

### Smart Contract Architecture

**HashYield.sol**
- Main staking contract
- Manages user deposits and withdrawals
- Calculates and tracks interest accrual
- Mints reward tokens (cETH)
- Implements reentrancy protection

**HashYieldToken.sol**
- ERC20-compliant reward token
- Symbol: cETH (Confidential Ether)
- Decimals: 18
- Mintable only by HashYield contract
- Standard transfer and approval mechanisms

**ConfidentialETH.sol** (Future Enhancement)
- Extends ERC7984 for confidential operations
- Integrates FHEVM for encrypted balances
- Enables private transactions

## How It Works

### Staking Process

1. **User deposits ETH**
   - User calls `stake()` with ETH value
   - Contract records stake amount and timestamp
   - Updates total staked amount
   - Emits `Staked` event

2. **Interest Accrual**
   - Interest calculated per second: `(amount × elapsed_time) / seconds_per_day`
   - Automatic accrual on any interaction
   - View claimable interest anytime via `claimableInterest()`

3. **Claiming Rewards**
   - User calls `claimInterest()`
   - Contract calculates all accrued interest
   - Mints equivalent cETH tokens to user
   - Resets unclaimed interest counter
   - Emits `InterestClaimed` event

4. **Withdrawal**
   - User calls `withdraw(amount)` or `withdrawAll()`
   - Contract verifies sufficient balance
   - Accrues any pending interest first
   - Transfers ETH back to user
   - Updates stake records
   - Emits `Withdrawn` event

### Interest Calculation Example

```
User stakes: 10 ETH
Rate: 1 cETH per ETH per day
Time elapsed: 12 hours (0.5 days)

Interest = 10 ETH × 0.5 days × 1 cETH/ETH/day = 5 cETH
```

After 12 hours, the user can claim 5 cETH tokens. Interest continues accruing every second until withdrawn or claimed.

## Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 7.0.0
- **Git**
- **MetaMask** or another Web3 wallet (for frontend interaction)
- **Infura API Key** (for testnet/mainnet deployment)
- **Private Key** (for contract deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/HushYield.git
   cd HushYield
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Configuration

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   ```env
   # .env
   INFURA_API_KEY=your_infura_api_key
   PRIVATE_KEY=your_wallet_private_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

   **Never commit your `.env` file or expose your private keys!**

3. **Configure frontend contract address**

   After deploying contracts, update the contract address in:
   ```typescript
   // frontend/src/config/contracts.ts
   export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
   ```

## Usage

### Compiling Contracts

```bash
npm run compile
```

This will:
- Compile all Solidity contracts
- Generate TypeScript types via TypeChain
- Output artifacts to `artifacts/` directory

### Running Tests

```bash
# Run all tests
npm test

# Run tests with gas reporting
REPORT_GAS=true npm test

# Run tests with coverage
npm run coverage
```

**Test Coverage**: The project includes comprehensive tests covering:
- Staking deposits and totals
- Interest accrual calculations
- Multiple stakes from different users
- Withdrawals (partial and full)
- Reward claiming
- Edge cases and error conditions

### Deploying Contracts

#### Local Development (Hardhat Network)

1. **Start local node**
   ```bash
   npm run chain
   ```

2. **Deploy contracts** (in a new terminal)
   ```bash
   npm run deploy:localhost
   ```

#### Sepolia Testnet

1. **Ensure you have Sepolia ETH**
   - Get testnet ETH from [Sepolia faucet](https://sepoliafaucet.com/)

2. **Deploy to Sepolia**
   ```bash
   npm run deploy:sepolia
   ```

3. **Verify contracts** (optional)
   ```bash
   npm run verify:sepolia
   ```

The deployment script will output:
- HashYield contract address
- cETH token address

**Update these addresses in your frontend configuration!**

### Running the Frontend

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Update contract address**
   Edit `src/config/contracts.ts` with your deployed contract address

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

The frontend will be available at `http://localhost:5173`

### Interacting with the dApp

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select your wallet (MetaMask, WalletConnect, etc.)
   - Approve connection

2. **Stake ETH**
   - Enter amount to stake
   - Click "Stake ETH"
   - Confirm transaction in wallet
   - Wait for confirmation

3. **Monitor Earnings**
   - View real-time balance updates
   - See claimable cETH rewards
   - Track total staked across protocol

4. **Claim Rewards**
   - Click "Claim Interest" when available
   - Confirm transaction
   - cETH tokens added to wallet

5. **Withdraw**
   - Enter amount to withdraw (or withdraw all)
   - Confirm transaction
   - ETH returned to wallet

## Smart Contracts

### HashYield.sol

**Main Functions:**

```solidity
function stake() external payable
```
Stake ETH to start earning rewards. Sends ETH with transaction.

```solidity
function withdraw(uint256 amount) external
```
Withdraw a specific amount of staked ETH.

```solidity
function withdrawAll() external
```
Withdraw all staked ETH.

```solidity
function claimInterest() external
```
Claim all accrued cETH rewards.

```solidity
function claimableInterest(address account) public view returns (uint256)
```
View pending interest for an account.

```solidity
function getStake(address account) external view returns (uint256 amount, uint256 unclaimedInterest, uint256 lastAccrued)
```
Get complete staking information for an account.

**Events:**

```solidity
event Staked(address indexed account, uint256 amount, uint256 newBalance)
event Withdrawn(address indexed account, uint256 amount, uint256 remainingBalance)
event InterestClaimed(address indexed account, uint256 amount)
```

### HashYieldToken.sol (cETH)

Standard ERC20 token with:
- Name: "Confidential Ether"
- Symbol: "cETH"
- Decimals: 18
- Minting restricted to HashYield contract

### Key Contract Addresses

**Sepolia Testnet** (Update after deployment)
- HashYield: `0x...`
- cETH Token: `0x...`

## Security Features

### 1. Reentrancy Protection
- All state-changing functions protected with `nonReentrant` modifier
- Follows Checks-Effects-Interactions pattern
- State updates before external calls

### 2. Integer Overflow Protection
- Solidity 0.8.27 with built-in overflow/underflow checks
- No unchecked arithmetic in critical paths
- Safe math operations throughout

### 3. Access Control
- Token minting restricted to HashYield contract
- No admin privileges or backdoors
- Immutable contract references

### 4. Input Validation
- Zero amount checks on stake/withdraw
- Balance sufficiency verification
- Zero address prevention

### 5. Transparent Logic
- All calculations performed on-chain
- No hidden fees or admin cuts
- Auditable state changes

### 6. Gas Optimization
- Efficient storage patterns
- Minimal storage writes
- Optimized for common operations

### Best Practices
- Follows OpenZeppelin standards
- Comprehensive event logging
- Clear error messages
- Extensive test coverage

## Future Roadmap

### Phase 1: Privacy Enhancement (Q2 2025)
- [ ] Full FHEVM integration for confidential balances
- [ ] Encrypted transaction amounts
- [ ] Private balance queries
- [ ] Zama's Key Management Service integration

### Phase 2: Advanced Features (Q3 2025)
- [ ] Multiple staking tiers with different rates
- [ ] Governance token (gHUSH) for protocol decisions
- [ ] Staking boost mechanisms
- [ ] Referral rewards system
- [ ] Auto-compounding option

### Phase 3: DeFi Integrations (Q4 2025)
- [ ] cETH trading on DEXs
- [ ] Lending/borrowing with staked positions
- [ ] Yield farming opportunities
- [ ] Cross-chain bridge support
- [ ] Integration with other privacy protocols

### Phase 4: Ecosystem Expansion (2026)
- [ ] Mobile application
- [ ] Multi-asset staking (BTC, stablecoins)
- [ ] Institutional staking features
- [ ] Advanced analytics dashboard
- [ ] DAO governance implementation
- [ ] Bug bounty program

### Phase 5: Scaling & Optimization (2026)
- [ ] Layer 2 deployment (Arbitrum, Optimism)
- [ ] Gas optimization upgrades
- [ ] Batch operations for gas savings
- [ ] Enhanced frontend performance
- [ ] Advanced portfolio management tools

### Research & Development
- Zero-knowledge proof integration
- Alternative consensus mechanisms
- Interoperability with other privacy chains
- Regulatory compliance frameworks
- Advanced cryptographic primitives

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements, your help is appreciated.

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/HushYield.git
   cd HushYield
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Submit a pull request**
   - Describe your changes clearly
   - Reference any related issues
   - Ensure all tests pass

### Development Guidelines

- **Code Style**: Follow the existing TypeScript/Solidity conventions
- **Testing**: Maintain or improve test coverage
- **Documentation**: Update README and inline comments
- **Commits**: Use clear, descriptive commit messages
- **Security**: Never commit private keys or sensitive data

### Reporting Issues

Found a bug? Have a suggestion? Please [open an issue](https://github.com/yourusername/HushYield/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

### What This Means

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No patent grant
- ❌ No trademark rights
- ❌ No warranty provided

See the [LICENSE](LICENSE) file for full details.

### Third-Party Licenses

This project uses several open-source libraries, each with their own licenses:
- FHEVM: BSD-3-Clause-Clear
- OpenZeppelin: MIT
- React: MIT
- Hardhat: MIT

See individual package licenses for details.

---

## Acknowledgments

- **Zama** for FHEVM technology and confidential smart contract infrastructure
- **OpenZeppelin** for secure smart contract libraries
- **Ethereum Foundation** for the Ethereum platform
- **Hardhat** team for excellent development tools
- **React** and **Vite** teams for modern frontend tooling

## Links

- **Website**: [Coming Soon]
- **Documentation**: [Coming Soon]
- **Discord**: [Coming Soon]
- **Twitter**: [Coming Soon]
- **GitHub**: https://github.com/yourusername/HushYield

## Disclaimer

This software is provided "as is" without warranty of any kind. Use at your own risk. Always conduct your own research and security audits before deploying to mainnet or staking significant funds. The developers assume no liability for any losses incurred through the use of this protocol.

**Not Financial Advice**: This project is experimental DeFi software. Do not stake more than you can afford to lose. Always start with small amounts on testnet.

---

**Built with privacy, powered by FHEVM, secured by mathematics.**

*HushYield - Where Privacy Meets Yield*
