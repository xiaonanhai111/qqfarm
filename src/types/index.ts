/**
 * QQ Farm 类型定义
 */

export type CropKey =
  | 'carrot'
  | 'tomato'
  | 'corn'
  | 'wheat'
  | 'flower'
  | 'strawberry';

export type PlotStage =
  | 'locked'    // 未解锁
  | 'empty'     // 空地
  | 'sprout'    // 幼苗
  | 'grow'      // 生长
  | 'ripe'      // 成熟
  | 'withered'; // 需浇水/枯萎

export interface Crop {
  key: CropKey;
  emoji: string;
  name: string;
  /** 从种下到成熟的时间（毫秒） */
  durationMs: number;
  /** 收获奖励金币 */
  reward: number;
  /** 收获经验 */
  exp: number;
  /** 种子价格 */
  cost: number;
  /** 商店分类 */
  category: 'seeds' | 'flowers';
}

export interface Plot {
  id: number;
  cropType: CropKey | null;
  /** 种下时间戳（ms） */
  plantedAt: number;
  needsWater?: boolean;
  locked?: boolean;
  lockLevel?: number;
}

export interface Task {
  id: string;
  text: string;
  goal: number;
  progress: number;
  reward: number;
  claimed: boolean;
  kind?: 'harvest' | 'water' | 'visit' | 'plant';
}

export interface Friend {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  level: number;
  online: boolean;
}

/** 商店商品条目 */
export interface ShopItem {
  key: string;
  emoji: string;
  name: string;
  desc: string;
  price: number;
  category: 'seeds' | 'flowers' | 'tools' | 'decor';
  /** 关联的作物 key（种子类商品必填） */
  cropKey?: CropKey;
}

/** 仓库物品 */
export interface InventoryItem {
  key: string;
  emoji: string;
  name: string;
  count: number;
  category: 'crop' | 'seed' | 'tool';
}

export interface GameState {
  coin: number;
  exp: number;
  expMax: number;
  level: number;
  energy: number;
  plots: Plot[];
  tasks: Task[];
  stats: {
    harvested: number;
    watered: number;
    visited: number;
    planted: number;
  };
  inventory: InventoryItem[];
  friends: Friend[];
  lastSyncAt: number;
}

export type ToastKind = 'default' | 'info' | 'warn' | 'danger';
export interface ToastItem {
  id: number;
  msg: string;
  kind: ToastKind;
}
