import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const isCorrectChain = chainId === base.id || chainId === baseSepolia.id

  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-gray-400 mb-4">
            Connect Metamask or OKX Wallet to save your scores on Base blockchain
          </p>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="connect-btn"
            >
              {isPending ? 'Connecting...' : `Connect ${connector.name}`}
            </button>
          ))}
        </div>
      ) : (
        <div className="connected-wallet">
          <div className="wallet-info">
            <span className="wallet-label">Connected:</span>
            <span className="wallet-address">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
          
          {!isCorrectChain && (
            <button
              onClick={() => switchChain({ chainId: base.id })}
              className="switch-chain-btn"
            >
              Switch to Base Network
            </button>
          )}
          
          <button onClick={() => disconnect()} className="disconnect-btn">
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
