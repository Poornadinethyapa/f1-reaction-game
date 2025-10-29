import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Base mainnet configuration
export const baseChain = base;

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({ target: 'metaMask' }),
    injected({ target: 'okxWallet' as any }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
})

// Contract address - this will be set after deployment
export const SCORE_REGISTRY_ADDRESS = import.meta.env.VITE_SCORE_REGISTRY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000'
