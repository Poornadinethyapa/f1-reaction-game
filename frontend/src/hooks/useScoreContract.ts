import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { SCORE_REGISTRY_ADDRESS } from '../config/wagmi'
import ScoreRegistryABI from '../config/ScoreRegistry.json'

export function useScoreContract() {
  // Write contract hook for submitting scores
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash 
  })

  const submitScore = async (scoreValue: number, metadataHash: string = '0x0000000000000000000000000000000000000000000000000000000000000000') => {
    try {
      await writeContract({
        address: SCORE_REGISTRY_ADDRESS,
        abi: ScoreRegistryABI.abi,
        functionName: 'submitScore',
        args: [BigInt(scoreValue), metadataHash as `0x${string}`],
      })
    } catch (err) {
      console.error('Error submitting score:', err)
      throw err
    }
  }

  return {
    submitScore,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error
  }
}

export function useLatestScore(address: `0x${string}` | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: SCORE_REGISTRY_ADDRESS,
    abi: ScoreRegistryABI.abi,
    functionName: 'latestScoreOf',
    args: address ? [address] : undefined,
  })

  if (!data || !Array.isArray(data)) {
    return { score: null, timestamp: null, metadataHash: null, isLoading, isError, refetch }
  }

  return {
    score: data[0] ? Number(data[0]) : null,
    timestamp: data[1] ? Number(data[1]) : null,
    metadataHash: data[2] as string,
    isLoading,
    isError,
    refetch
  }
}

export function useTotalSubmissions() {
  const { data, isError, isLoading } = useReadContract({
    address: SCORE_REGISTRY_ADDRESS,
    abi: ScoreRegistryABI.abi,
    functionName: 'totalSubmissions',
  })

  return {
    totalSubmissions: data ? Number(data) : 0,
    isLoading,
    isError
  }
}
