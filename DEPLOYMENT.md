# Deployment Guide

Complete guide for deploying the F1 Reaction Race dApp to Base blockchain.

## Prerequisites

- [x] Node.js 18+ installed
- [x] Private key with Base ETH for deployment
- [x] BaseScan API key (for verification)
- [x] Metamask or OKX Wallet configured

## Step-by-Step Deployment

### 1. Contract Deployment

#### A. Configure Environment

```bash
cd contracts
cp .env.example .env
```

Edit `.env` file:
```env
DEPLOYER_PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key
```

**Security Warning**: Never commit your `.env` file to git!

#### B. Deploy to Base Sepolia (Testnet)

1. Get testnet ETH:
   - Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
   - Request ETH to your deployer address

2. Deploy:
   ```bash
   npm run deploy:sepolia
   ```

3. Save the contract address from the output:
   ```
   ScoreRegistry deployed to: 0x...
   ```

#### C. Deploy to Base Mainnet (Production)

1. Ensure you have real ETH on Base mainnet

2. Deploy:
   ```bash
   npm run deploy:mainnet
   ```

3. Save the contract address

#### D. Verify Contract

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

Or for Sepolia:
```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

### 2. Frontend Configuration

#### A. Update Contract Address

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_SCORE_REGISTRY_ADDRESS=0xYourDeployedContractAddress
```

#### B. Build Frontend

```bash
npm run build
```

This creates a `dist/` folder with production-ready files.

### 3. Frontend Deployment Options

#### Option A: Replit Deployment (Recommended)

1. The project is already configured for Replit deployment
2. Click "Deploy" in Replit dashboard
3. Your dApp will be live at your Replit URL

#### Option B: Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

3. Follow the prompts
4. Set environment variable in Vercel dashboard:
   - `VITE_SCORE_REGISTRY_ADDRESS=0x...`

#### Option C: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   cd frontend
   netlify deploy --prod
   ```

3. Set environment variables in Netlify dashboard

#### Option D: GitHub Pages

1. Update `vite.config.ts` with base path:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Deploy `dist/` folder to GitHub Pages

### 4. Post-Deployment Checklist

- [ ] Contract verified on BaseScan
- [ ] Frontend environment variables set
- [ ] Test wallet connection on deployed site
- [ ] Test score submission transaction
- [ ] Verify score appears on blockchain
- [ ] Check contract on BaseScan shows correct owner
- [ ] Test with both Metamask and OKX Wallet
- [ ] Test on mobile devices

### 5. Monitoring

#### Contract Monitoring

1. **BaseScan**: Monitor transactions at `https://basescan.org/address/<CONTRACT_ADDRESS>`

2. **Events**: Watch for `ScoreSubmitted` events

3. **Gas Usage**: Track average gas costs

#### Frontend Monitoring

1. **Analytics**: Add Google Analytics or Plausible
2. **Error Tracking**: Consider Sentry for error monitoring
3. **Web3 Provider**: Monitor wallet connection success rates

### 6. Maintenance

#### Contract Upgrades

⚠️ **Note**: The current contract is not upgradeable. To upgrade:

1. Deploy new contract version
2. Update frontend `.env` with new address
3. Redeploy frontend
4. Communicate migration to users

#### Pausing Contract

In case of emergency:

```solidity
// Call as contract owner
scoreRegistry.setPaused(true);
```

## Gas Optimization Tips

1. **Batch Operations**: Encourage users to submit their best score only
2. **L2 Benefits**: Base fees are 10-100x lower than Ethereum mainnet
3. **Off-Peak**: Gas is generally cheaper during off-peak hours

## Testnet vs Mainnet

| Network | Chain ID | RPC URL | Block Explorer |
|---------|----------|---------|----------------|
| Base Sepolia | 84532 | https://sepolia.base.org | https://sepolia.basescan.org |
| Base Mainnet | 8453 | https://mainnet.base.org | https://basescan.org |

## Troubleshooting

### Contract Deployment Fails

- **Insufficient funds**: Ensure deployer account has enough ETH
- **Gas price too low**: Increase gas price in hardhat.config.ts
- **Nonce issues**: Try `npx hardhat clean`

### Verification Fails

- **Wait time**: Wait 30 seconds after deployment
- **Constructor args**: Ensure no constructor arguments are passed
- **Compiler version**: Must match solidity version (0.8.20)

### Frontend Issues

- **Wallet won't connect**: Ensure wallet is on Base network
- **Transactions fail**: Check contract address is correct
- **"Contract not found"**: Verify contract is deployed to correct network

## Security Considerations

1. **Private Key**: Never expose your deployer private key
2. **Contract Ownership**: Transfer to multi-sig after deployment
3. **Rate Limiting**: Consider implementing rate limiting for score submissions
4. **Frontend**: Use HTTPS only in production
5. **Environment Variables**: Never expose private keys in frontend `.env`

## Cost Estimates

### Base Sepolia (Testnet)
- FREE (use faucet for testnet ETH)

### Base Mainnet (Production)
- Contract deployment: ~$1-5 (one-time)
- Score submission: ~$0.001-0.01 per transaction
- Total for 1000 scores: ~$1-10

*Costs vary with gas prices and network congestion*

## Support

For deployment issues:
1. Check [Base Discord](https://discord.gg/buildonbase)
2. Review [Base Docs](https://docs.base.org)
3. Open GitHub issue

---

**Happy Deploying! 🚀**
