import type { Crop, CropKey } from '../types';

/**
 * 作物数据库（迁移自画布 CROP_LIB）
 * durationMs 与画布保持一致，方便原型演示（秒级成熟）
 */
export const CROP_LIB: Record<CropKey, Crop> = {
  carrot: {
    key: 'carrot',
    emoji: '🥕',
    name: '胡萝卜',
    durationMs: 8000,
    reward: 90,
    exp: 12,
    cost: 50,
    category: 'seeds',
  },
  tomato: {
    key: 'tomato',
    emoji: '🍅',
    name: '番茄',
    durationMs: 12000,
    reward: 140,
    exp: 18,
    cost: 80,
    category: 'seeds',
  },
  corn: {
    key: 'corn',
    emoji: '🌽',
    name: '玉米',
    durationMs: 15000,
    reward: 200,
    exp: 25,
    cost: 120,
    category: 'seeds',
  },
  wheat: {
    key: 'wheat',
    emoji: '🌾',
    name: '小麦',
    durationMs: 10000,
    reward: 110,
    exp: 10,
    cost: 60,
    category: 'seeds',
  },
  flower: {
    key: 'flower',
    emoji: '🌸',
    name: '花朵',
    durationMs: 20000,
    reward: 320,
    exp: 35,
    cost: 200,
    category: 'flowers',
  },
  strawberry: {
    key: 'strawberry',
    emoji: '🍓',
    name: '草莓',
    durationMs: 18000,
    reward: 260,
    exp: 28,
    cost: 150,
    category: 'seeds',
  },
};

export const ALL_CROP_KEYS: CropKey[] = Object.keys(CROP_LIB) as CropKey[];
