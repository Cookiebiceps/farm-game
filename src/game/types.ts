export type CropId = 'wheat' | 'carrot' | 'tomato' | 'pumpkin'

export interface Crop {
  id: CropId
  name: string
  /** Emoji shown when the crop is fully grown. */
  emoji: string
  /** Cost in coins to plant one seed. */
  seedCost: number
  /** Coins earned when harvesting a mature crop. */
  sellPrice: number
  /** Time in milliseconds for the crop to fully grow. */
  growMs: number
}

export interface Plot {
  id: number
  cropId: CropId | null
  /** Epoch ms when the seed was planted, or null if the plot is empty. */
  plantedAt: number | null
}

export interface GameState {
  coins: number
  plots: Plot[]
  totalHarvested: number
  totalEarned: number
}
