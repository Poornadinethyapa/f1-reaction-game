import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import { WalletConnect } from './components/WalletConnect'
import { F1Game } from './components/F1Game'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="app">
          <header className="header">
            <div className="header-content">
              <h1 className="logo">🏎️ F1 Reaction Race</h1>
              <div className="header-wallet">
                <WalletConnect />
              </div>
            </div>
          </header>

          <main className="container">
            <F1Game />
          </main>

          <footer className="footer">
            <p>&copy; 2024 F1 Reaction Race dApp on Base. Built with ❤️ for racing fans.</p>
            <p className="tech-stack">
              Powered by Base blockchain • Wagmi • React
            </p>
          </footer>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
