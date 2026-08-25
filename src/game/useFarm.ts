import { useCallback, useEffect, useRef, useState } from 'react'
import { CROPS } from './crops'
import type { CropId, GameState, Plot } from './types'

const STORAGE_KEY = 'farm-game:v1'
const PLOT_COUNT = 12
const STARTING_COINS = 20
const TICK_MS = 200

function createInitialState(): GameState {
  const plots: Plot[] = Array.from({ length: PLOT_COUNT }, (_, id) => ({
    id,
    cropId: null,
    plantedAt: null,
  }))
  return { coins: STARTING_COINS, plots, totalHarvested: 0, totalEarned: 0 }
}

function loadState(): GameState {
  if (typeof localStorage === 'undefined') return createInitialState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw) as Partial<GameState>
    if (
      typeof parsed.coins !== 'number' ||
      !Array.isArray(parsed.plots) ||
      parsed.plots.length !== PLOT_COUNT
    ) {
      return createInitialState()
    }
    return {
      coins: parsed.coins,
      plots: parsed.plots as Plot[],
      totalHarvested: parsed.totalHarvested ?? 0,
      totalEarned: parsed.totalEarned ?? 0,
    }
  } catch {
    return createInitialState()
  }
}

export interface FarmApi {
  state: GameState
  now: number
  selectedSeed: CropId
  setSelectedSeed: (cropId: CropId) => void
  /** Progress from 0 to 1 for a plot; 0 for empty plots. */
  progressFor: (plot: Plot) => number
  isReady: (plot: Plot) => boolean
  /** Plant the selected seed, or harvest if the plot is mature. */
  handlePlot: (plotId: number) => void
  resetGame: () => void
  lastMessage: string
}

export function useFarm(): FarmApi {
  const [state, setState] = useState<GameState>(loadState)
  const [now, setNow] = useState<number>(() => Date.now())
  const [selectedSeed, setSelectedSeed] = useState<CropId>('wheat')
  const [lastMessage, setLastMessage] = useState<string>('Welcome to your farm! 🌱')
  const nowRef = useRef(now)
  nowRef.current = now

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const progressFor = useCallback(
    (plot: Plot): number => {
      if (!plot.cropId || plot.plantedAt == null) return 0
      const crop = CROPS[plot.cropId]
      const elapsed = now - plot.plantedAt
      return Math.max(0, Math.min(1, elapsed / crop.growMs))
    },
    [now],
  )

  const isReady = useCallback(
    (plot: Plot): boolean => progressFor(plot) >= 1,
    [progressFor],
  )

  const handlePlot = useCallback(
    (plotId: number) => {
      setState((prev) => {
        const plot = prev.plots[plotId]
        if (!plot) return prev

        // Empty plot: try to plant the selected seed.
        if (!plot.cropId) {
          const crop = CROPS[selectedSeed]
          if (prev.coins < crop.seedCost) {
            setLastMessage(`Not enough coins for ${crop.name}. 🪙`)
            return prev
          }
          setLastMessage(`Planted ${crop.name} ${crop.emoji}`)
          const plots = prev.plots.map((p) =>
            p.id === plotId
              ? { ...p, cropId: selectedSeed, plantedAt: nowRef.current }
              : p,
          )
          return { ...prev, coins: prev.coins - crop.seedCost, plots }
        }

        // Growing crop: only harvest once mature.
        const crop = CROPS[plot.cropId]
        const elapsed = nowRef.current - (plot.plantedAt ?? 0)
        if (elapsed < crop.growMs) {
          setLastMessage(`${crop.name} is still growing… 🌱`)
          return prev
        }

        setLastMessage(`Harvested ${crop.name} for ${crop.sellPrice} coins! ${crop.emoji}`)
        const plots = prev.plots.map((p) =>
          p.id === plotId ? { ...p, cropId: null, plantedAt: null } : p,
        )
        return {
          ...prev,
          coins: prev.coins + crop.sellPrice,
          totalHarvested: prev.totalHarvested + 1,
          totalEarned: prev.totalEarned + crop.sellPrice,
          plots,
        }
      })
    },
    [selectedSeed],
  )

  const resetGame = useCallback(() => {
    setState(createInitialState())
    setSelectedSeed('wheat')
    setLastMessage('Farm reset. Fresh soil! 🌱')
  }, [])

  return {
    state,
    now,
    selectedSeed,
    setSelectedSeed,
    progressFor,
    isReady,
    handlePlot,
    resetGame,
    lastMessage,
  }
}
