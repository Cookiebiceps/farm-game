import type { Crop, CropId } from './types'

export const CROPS: Record<CropId, Crop> = {
  wheat: {
    id: 'wheat',
    name: 'Wheat',
    emoji: '🌾',
    seedCost: 5,
    sellPrice: 12,
    growMs: 8_000,
  },
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    emoji: '🥕',
    seedCost: 8,
    sellPrice: 20,
    growMs: 12_000,
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    emoji: '🍅',
    seedCost: 12,
    sellPrice: 30,
    growMs: 16_000,
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Pumpkin',
    emoji: '🎃',
    seedCost: 20,
    sellPrice: 55,
    growMs: 24_000,
  },
}

export const CROP_LIST: Crop[] = Object.values(CROPS)

/** Emoji stages shown as a crop matures (0 = just planted, 1 = fully grown). */
export function growthEmoji(crop: Crop, progress: number): string {
  if (progress >= 1) return crop.emoji
  if (progress >= 0.5) return '🌿'
  return '🌱'
}
