import type { GameState } from '../types';
import { FRIENDS_INITIAL } from './friends';

/**
 * 首次进入游戏的默认存档
 * 时间戳用相对当前时间的负偏移，保证展示时刚好处在不同生长阶段
 */
export const buildInitialState = (): GameState => {
  const now = Date.now();
  return {
    coin: 28650,
    exp: 6200,
    expMax: 10000,
    level: 28,
    energy: 36,
    plots: [
      { id: 0,  cropType: 'carrot',  plantedAt: now - 9000 },
      { id: 1,  cropType: 'tomato',  plantedAt: now - 13000 },
      { id: 2,  cropType: 'corn',    plantedAt: now - 11500 },
      { id: 3,  cropType: 'wheat',   plantedAt: now - 2200 },
      { id: 4,  cropType: null,      plantedAt: 0 },
      { id: 5,  cropType: 'wheat',   plantedAt: now - 8000, needsWater: true },
      { id: 6,  cropType: 'wheat',   plantedAt: now - 5400 },
      { id: 7,  cropType: 'flower',  plantedAt: now - 21000 },
      { id: 8,  cropType: 'carrot',  plantedAt: now - 1200 },
      { id: 9,  cropType: null,      plantedAt: 0 },
      { id: 10, cropType: null,      plantedAt: 0, locked: true },
      { id: 11, cropType: null,      plantedAt: 0, locked: true, lockLevel: 30 },
    ],
    tasks: [
      { id: 't1', text: '收获 5 次作物',   goal: 5, progress: 0, reward: 200, claimed: false, kind: 'harvest' },
      { id: 't2', text: '给作物浇水 8 次', goal: 8, progress: 0, reward: 150, claimed: false, kind: 'water' },
      { id: 't3', text: '拜访 3 位好友',   goal: 3, progress: 0, reward: 100, claimed: false, kind: 'visit' },
    ],
    stats: { harvested: 0, watered: 0, visited: 0, planted: 0 },
    inventory: [
      { key: 'seed-carrot', emoji: '🥕', name: '胡萝卜种子', count: 12, category: 'seed' },
      { key: 'seed-wheat',  emoji: '🌾', name: '小麦种子',   count: 8,  category: 'seed' },
      { key: 'seed-tomato', emoji: '🍅', name: '番茄种子',   count: 5,  category: 'seed' },
    ],
    friends: FRIENDS_INITIAL,
    lastSyncAt: now,
  };
};
