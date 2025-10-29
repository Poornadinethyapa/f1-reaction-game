# F1 Reaction Race dApp 🏎️⛓️

A decentralized application (dApp) that transforms the classic F1 reaction time game into a Web3 experience on Base blockchain. Test your reflexes and save your best scores permanently on-chain!

## 🌟 Features

- **Authentic F1 Start Light Simulation**: 5-column F1 start light sequence just like real Formula 1
- **Web3 Integration**: Connect with Metamask or OKX Wallet
- **On-Chain Score Storage**: Your best scores are saved permanently on Base blockchain
- **Gas Efficient**: Optimized smart contract design minimizes transaction costs
- **Real-time Feedback**: See your transaction status and confirmations
- **Performance Ratings**: Compare your reaction time to F1 driver standards

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity 0.8.20**: Latest stable version with built-in overflow protection
- **Hardhat**: Development environment and testing framework
- **OpenZeppelin**: Battle-tested security libraries
- **Base Mainnet**: L2 blockchain (Chain ID: 8453)

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool with HMR
- **wagmi**: React hooks for Ethereum
- **viem**: TypeScript library for Ethereum
- **Tailwind CSS**: Utility-first CSS framework

## 📁 Project Structure

```
.
├── contracts/                 # Smart contract code
│   ├── contracts/
│   │   └── ScoreRegistry.sol # Main contract
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Contract tests
│   └── hardhat.config.ts    # Hardhat configuration
│
├── frontend/                 # React dApp
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── config/          # Configuration files
│   │   └── App.tsx          # Main app component
│   ├── index.html
│   └── vite.config.ts
│
├── assets/                   # Original game assets
├── index.html               # Original static game
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Metamask or OKX Wallet browser extension
- Base Sepolia testnet ETH (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd f1-reaction-race
   ```

2. **Install contract dependencies**
   ```bash
   cd contracts
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Compile smart contracts**
   ```bash
   cd contracts
   npm run compile
   ```

2. **Run contract tests**
   ```bash
   npm test
   ```

3. **Start frontend development server**
   ```bash
   cd ../frontend
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5000`
   - Connect your Metamask or OKX Wallet
   - Make sure you're on Base network

## 📝 Smart Contract

### ScoreRegistry.sol

The smart contract stores user reaction time scores on Base blockchain.

**Key Features:**
- Gas-efficient storage (latest score only on-chain)
- Event emissions for full history indexing
- Admin pause functionality
- Reentrancy protection
- Max score validation (1,000,000ms)

**Main Functions:**
```solidity
function submitScore(uint256 value, bytes32 metadataHash) external
function latestScoreOf(address user) external view returns (uint256, uint256, bytes32)
function myLatestScore() external view returns (uint256, uint256, bytes32)
```

### Contract Tests

18 comprehensive tests covering:
- ✅ Score submission
- ✅ Validation (max score, pause state)
- ✅ Access control
- ✅ Multiple users
- ✅ Event emissions

Run tests:
```bash
cd contracts
npm test
```

## 🌐 Deployment

### Deploy to Base Sepolia (Testnet)

1. **Set up environment variables**
   ```bash
   cd contracts
   cp .env.example .env
   # Edit .env and add your private key
   ```

2. **Get testnet ETH**
   - Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
   - Request testnet ETH

3. **Deploy contract**
   ```bash
   npm run deploy:sepolia
   ```

4. **Copy contract address**
   - Update `frontend/.env` with the deployed contract address
   ```
   VITE_SCORE_REGISTRY_ADDRESS=0xYourContractAddress
   ```

5. **Verify contract** (optional)
   ```bash
   npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
   ```

### Deploy to Base Mainnet

1. **Ensure you have mainnet ETH** on Base

2. **Update private key** in `.env`

3. **Deploy**
   ```bash
   npm run deploy:mainnet
   ```

4. **Verify on BaseScan**
   ```bash
   npx hardhat verify --network base <CONTRACT_ADDRESS>
   ```

## 🎮 How to Play

1. **Connect your wallet** (Metamask or OKX Wallet)
2. **Switch to Base network** if not already connected
3. **Click "CLICK TO START"** to begin
4. **Watch the red lights** turn on column by column
5. **React instantly** when all lights go out
6. **Your score is saved** on the blockchain!

## ⛽ Gas Costs

Approximate gas costs on Base:
- Score submission: ~50,000 gas
- Est. cost at 1 gwei: <$0.01
- Base L2 provides significantly lower fees than Ethereum mainnet

## 🔒 Security

- ✅ OpenZeppelin security libraries
- ✅ Reentrancy guards
- ✅ Access control (Ownable)
- ✅ Input validation
- ✅ Pausable functionality
- ✅ Comprehensive test coverage

## 📊 Performance Benchmarks

According to the game:
- < 150ms: 🔥 Superhuman!
- 150-200ms: ⚡ F1 Driver Level!
- 200-250ms: 🏎️ Amazing Reflexes!
- 250-300ms: 👍 Great Start!
- 300-400ms: 😊 Good Reaction!
- > 400ms: 🐌 Keep Practicing!

Professional F1 drivers typically react in 150-200ms!

## 🔗 Useful Links

- [Base Docs](https://docs.base.org)
- [wagmi Documentation](https://wagmi.sh)
- [Hardhat Documentation](https://hardhat.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [BaseScan](https://basescan.org)

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 💡 Future Enhancements

- [ ] Add leaderboard from blockchain events
- [ ] Implement multiplayer races
- [ ] Add NFT rewards for top scores
- [ ] Create difficulty modes
- [ ] Mobile app version
- [ ] Sound effects
- [ ] Achievement system

---

Built with ❤️ for racing fans and Web3 enthusiasts
