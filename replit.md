# F1 Reaction Race dApp 🏎️⛓️

## Overview
F1 Reaction Race is now a decentralized application (dApp) that combines the classic F1 reaction time game with Web3 technology. Players test their reflexes and save their best scores permanently on the Base blockchain using Metamask or OKX Wallet.

## Project Type
**Web3 Decentralized Application**
- Smart contracts on Base blockchain (Solidity)
- React + TypeScript frontend with wagmi integration
- Vite build system with HMR

## Project Structure
```
.
├── contracts/                # Smart contract project
│   ├── contracts/
│   │   └── ScoreRegistry.sol # Solidity contract (18 tests passing)
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Contract tests (Hardhat + Chai)
│   ├── hardhat.config.ts     # Hardhat config for Base
│   └── package.json
│
├── frontend/                 # React dApp
│   ├── src/
│   │   ├── components/       # React components (WalletConnect, F1Game)
│   │   ├── hooks/            # Custom hooks (useScoreContract)
│   │   ├── config/           # wagmi + contract ABI
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx
│   ├── vite.config.ts        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS
│   └── package.json
│
├── assets/                   # Original static game assets
├── README.md                 # Comprehensive documentation
├── DEPLOYMENT.md             # Deployment guide
├── PRODUCTION_CHECKLIST.md   # Production checklist
└── .github/workflows/ci.yml  # CI/CD pipeline
```

## Features
### Game Features
- **F1 Start Light Simulation**: Authentic 5-column F1 start light sequence
- **Reaction Time Tracking**: Records times in milliseconds
- **Jump Start Detection**: Penalizes early clicks
- **Performance Ratings**: Compares times to F1 driver standards
- **Responsive Design**: Works on desktop and mobile

### Web3 Features
- **Wallet Connection**: Metamask and OKX Wallet support
- **Blockchain Storage**: Scores saved permanently on Base blockchain
- **Gas Efficient**: Optimized contract design (<50k gas per submission)
- **Real-time Feedback**: Transaction status and confirmations
- **Network Detection**: Auto-prompts to switch to Base network
- **Multi-chain Support**: Base Mainnet (8453) and Sepolia testnet (84532)

## Technical Stack

### Smart Contracts
- **Solidity**: 0.8.20
- **Hardhat**: Development & testing framework
- **OpenZeppelin**: Security libraries (Ownable, ReentrancyGuard)
- **Ethers.js**: 6.x for scripts
- **Base Blockchain**: L2 network (low fees)

### Frontend
- **React**: 18.x
- **TypeScript**: Type-safe development
- **Vite**: Fast dev server with HMR
- **wagmi**: 2.x - React hooks for Ethereum
- **viem**: TypeScript Ethereum library
- **Tailwind CSS**: Utility-first styling
- **@tanstack/react-query**: Async state management

## Development

### Smart Contracts
```bash
cd contracts
npm install
npm run compile  # Compile Solidity
npm test         # Run 18 tests
npm run deploy:sepolia  # Deploy to testnet
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Start dev server on port 5000
```

## Deployment

### Smart Contract Deployment
1. **Testnet First**: Deploy to Base Sepolia
   ```bash
   cd contracts
   cp .env.example .env
   # Add DEPLOYER_PRIVATE_KEY
   npm run deploy:sepolia
   ```

2. **Mainnet**: Deploy to Base
   ```bash
   npm run deploy:mainnet
   ```

3. **Verify**: Verify on BaseScan
   ```bash
   npx hardhat verify --network base <CONTRACT_ADDRESS>
   ```

### Frontend Deployment
Configured for Replit Autoscale:
- Automatically serves Vite React app
- Environment variables in `.env`
- Runs on port 5000

## Contract Details

### ScoreRegistry.sol
**Gas-efficient score storage with event indexing**

Key Functions:
- `submitScore(uint256 value, bytes32 metadataHash)`: Submit reaction time
- `latestScoreOf(address user)`: Read user's best score
- `myLatestScore()`: Read caller's score
- `setPaused(bool)`: Admin pause function

Events:
- `ScoreSubmitted(address indexed user, uint256 value, uint256 timestamp, bytes32 metadataHash)`
- `AdminCleared(address indexed admin, address indexed user)`
- `PauseStateChanged(bool isPaused)`

Security Features:
- ✅ Reentrancy protection
- ✅ Access control (Ownable)
- ✅ Input validation (max 1M ms)
- ✅ Pausable
- ✅ 18/18 tests passing

## Gas Costs
- Deployment: ~$1-5 (one-time)
- Score submission: ~50k gas (~$0.001-0.01 per tx)
- Base L2 provides 10-100x lower fees than Ethereum mainnet

## How It Works
1. **Connect Wallet**: Click to connect Metamask or OKX Wallet
2. **Switch Network**: Auto-prompt to switch to Base if needed
3. **Play Game**: Click to start, watch lights, react when they go out
4. **Submit Score**: Your reaction time is signed and sent to blockchain
5. **Confirmation**: Watch transaction get confirmed
6. **Permanent Record**: Your best score is saved on-chain forever!

## Recent Changes
- **2025-10-29**: Web3 Transformation
  - Created ScoreRegistry.sol smart contract
  - Configured Hardhat for Base mainnet & testnet
  - Wrote 18 comprehensive contract tests (all passing)
  - Built React + TypeScript frontend with Vite
  - Integrated wagmi for wallet connections
  - Created useScoreContract hook for blockchain interaction
  - Rebuilt game UI in React with Tailwind CSS
  - Added transaction status tracking
  - Created comprehensive documentation
  - Set up CI/CD pipeline
  - Configured deployment for Replit

## Environment Variables

### Contracts (`contracts/.env`)
```env
DEPLOYER_PRIVATE_KEY=your_key_here
BASESCAN_API_KEY=your_api_key
```

### Frontend (`frontend/.env`)
```env
VITE_SCORE_REGISTRY_ADDRESS=0xYourContractAddress
```

## Testing
- **Contract Tests**: 18/18 passing
  - Deployment checks
  - Score submission validation
  - Access control
  - Event emissions
  - Edge cases

## Supported Wallets
- Metamask (injected provider)
- OKX Wallet (injected provider)

## Supported Networks
- Base Mainnet (Chain ID: 8453)
- Base Sepolia Testnet (Chain ID: 84532)

## Performance Benchmarks
- < 150ms: 🔥 Superhuman!
- 150-200ms: ⚡ F1 Driver Level!
- 200-250ms: 🏎️ Amazing Reflexes!
- 250-300ms: 👍 Great Start!
- 300-400ms: 😊 Good Reaction!
- > 400ms: 🐌 Keep Practicing!

Professional F1 drivers typically react in 150-200ms!

## Future Enhancements
- [ ] Leaderboard from blockchain events (The Graph indexing)
- [ ] NFT rewards for top scores
- [ ] Multiplayer racing mode
- [ ] Achievement system
- [ ] Mobile app version
- [ ] Sound effects
- [ ] Difficulty levels
- [ ] Social sharing

## Documentation
- `README.md`: Complete project overview
- `DEPLOYMENT.md`: Detailed deployment guide
- `PRODUCTION_CHECKLIST.md`: Pre-launch checklist
- `.github/workflows/ci.yml`: Automated testing & deployment

## Resources
- [Base Docs](https://docs.base.org)
- [wagmi Documentation](https://wagmi.sh)
- [Hardhat](https://hardhat.org)
- [OpenZeppelin](https://docs.openzeppelin.com/contracts)
- [BaseScan Explorer](https://basescan.org)

## License
MIT - See LICENSE file

---

Built with ❤️ for racing fans and Web3 enthusiasts

From static HTML to blockchain-powered dApp! 🚀
