import { useState, useEffect, useRef } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { useScoreContract, useLatestScore } from '../hooks/useScoreContract'

type GameState = 'idle' | 'running' | 'ready' | 'submitting'

export function F1Game() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [state, setState] = useState<GameState>('idle')
  const [startTime, setStartTime] = useState(0)
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null)
  const [activeLights, setActiveLights] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [statusText, setStatusText] = useState('')
  const [resultMessage, setResultMessage] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout>()
  const stateRef = useRef<GameState>('idle')

  const { submitScore, isPending, isConfirming, isConfirmed, hash, error } = useScoreContract()
  const { score: bestScore, refetch: refetchScore } = useLatestScore(address)

  const isCorrectChain = chainId === base.id || chainId === baseSepolia.id

  // Keep stateRef in sync with state
  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (isConfirmed && hash) {
      setResultMessage(`✅ Score saved on blockchain! Tx: ${hash.slice(0, 10)}...`)
      refetchScore()
      setState('idle')
    }
  }, [isConfirmed, hash, refetchScore])

  useEffect(() => {
    if (error) {
      setResultMessage(`❌ Failed to save score: ${error.message.slice(0, 50)}...`)
      setState('idle')
    }
  }, [error])

  const resetLights = () => {
    setActiveLights(0)
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const startGame = async () => {
    setState('running')
    resetLights()
    setStatusText('')
    setResultMessage('')

    // Turn on lights column by column
    for (let col = 1; col <= 5; col++) {
      await sleep(600 + Math.random() * 200)
      if (stateRef.current !== 'running') return
      setActiveLights(col)
    }

    // Random delay before lights go out
    const delay = Math.random() * 2000 + 1000
    await sleep(delay)

    if (stateRef.current !== 'running') return

    // Lights out!
    resetLights()
    setState('ready')
    setStartTime(Date.now())
  }

  const handleClick = async () => {
    if (state === 'idle' || state === 'submitting') {
      startGame()
    } else if (state === 'running') {
      // Jump start!
      setState('idle')
      resetLights()
      setStatusText('🚫 FALSE START!')
      setResultMessage('You clicked too early. Try again!')
      setAttempts(prev => prev + 1)
    } else if (state === 'ready') {
      // Record time
      const reactionTime = Date.now() - startTime
      setLastReactionTime(reactionTime)
      setAttempts(prev => prev + 1)

      let rating = ''
      if (reactionTime < 150) rating = '🔥 SUPERHUMAN!'
      else if (reactionTime < 200) rating = '⚡ F1 DRIVER LEVEL!'
      else if (reactionTime < 250) rating = '🏎️ AMAZING REFLEXES!'
      else if (reactionTime < 300) rating = '👍 GREAT START!'
      else if (reactionTime < 400) rating = '😊 GOOD REACTION!'
      else rating = '🐌 KEEP PRACTICING!'

      setStatusText(rating)
      setResultMessage(`Your time: ${reactionTime}ms`)

      // Submit to blockchain if connected and on correct chain
      if (isConnected && isCorrectChain) {
        setState('submitting')
        try {
          await submitScore(reactionTime)
          setResultMessage(`⏳ Submitting ${reactionTime}ms to blockchain...`)
        } catch (err) {
          console.error('Submit error:', err)
          setState('idle')
        }
      } else {
        setState('idle')
        if (!isConnected) {
          setResultMessage(`${reactionTime}ms - Connect wallet to save on blockchain!`)
        } else if (!isCorrectChain) {
          setResultMessage(`${reactionTime}ms - Switch to Base network to save!`)
        }
      }
    }
  }

  const getButtonText = () => {
    if (state === 'idle') return 'CLICK TO START'
    if (state === 'running') return 'WAIT FOR LIGHTS...'
    if (state === 'ready') return 'GO GO GO!'
    if (state === 'submitting') return isPending ? 'SIGNING...' : 'CONFIRMING...'
    return 'CLICK TO START'
  }

  const getButtonClass = () => {
    let baseClass = 'click-area'
    if (state === 'running' || state === 'submitting') baseClass += ' disabled'
    if (state === 'ready') baseClass += ' ready'
    return baseClass
  }

  return (
    <div className="game-container">
      <div className="hero">
        <h2 className="title">Test Your F1 Driver Reflexes</h2>
        <p className="subtitle">React when all lights go out!</p>
        {isConnected && isCorrectChain && (
          <p className="blockchain-status">🔗 Connected to Base - Scores saved on blockchain</p>
        )}
      </div>

      {/* F1 Start Lights */}
      <div className="lights-container">
        {[1, 2, 3, 4, 5].map((col) => (
          <div key={col} className="light-column">
            {[1, 2, 3].map((row) => (
              <div
                key={row}
                className={`light ${activeLights >= col ? 'on' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Click Area */}
      <button
        className={getButtonClass()}
        onClick={handleClick}
        disabled={state === 'running' || (state === 'submitting' && (isPending || isConfirming))}
      >
        {getButtonText()}
      </button>

      {/* Status Messages */}
      {statusText && <div className="status-text">{statusText}</div>}
      {resultMessage && <div className="result-message">{resultMessage}</div>}
      {isConfirming && <div className="confirming-text">⏳ Waiting for block confirmation...</div>}

      {/* Statistics */}
      <div className="stats">
        <div className="stat-box">
          <div className="stat-label">Best Time</div>
          <div className="stat-value">{bestScore ? `${bestScore}ms` : '-'}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Last Time</div>
          <div className="stat-value">{lastReactionTime ? `${lastReactionTime}ms` : '-'}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Attempts</div>
          <div className="stat-value">{attempts}</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions">
        Watch the lights turn on one by one, then react instantly when they all go out!
        {isConnected && isCorrectChain && <br />}
        {isConnected && isCorrectChain && 'Your best score will be saved permanently on Base blockchain!'}
      </div>
    </div>
  )
}
