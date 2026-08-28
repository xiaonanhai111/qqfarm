import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CropKey, GameState, Plot, ToastItem, ToastKind } from '../types';
import { CROP_LIB } from '../data/crops';
import { buildInitialState } from '../data/initialState';
import { stageOf } from '../utils/plot';

const STORE_KEY = 'qq-farm-react-v1';

interface ToastActions {
  toasts: ToastItem[];
  pushToast: (msg: string, kind?: ToastKind) => void;
  dismissToast: (id: number) => void;
}

interface GameActions {
  /** 购买种子 → 直接触发种植（画布交互沿用） */
  plantSeed: (plotId: number, cropKey: CropKey) => { ok: boolean; msg: string };
  waterPlot: (plotId: number) => { ok: boolean; msg: string };
  harvestPlot: (plotId: number) => { ok: boolean; msg: string; reward?: number };
  harvestAll: () => { count: number; totalCoin: number; totalExp: number };
  visitFriend: (friendId: string) => { ok: boolean; msg: string };
  claimTask: (taskId: string) => { ok: boolean; msg: string };
  buyShopItem: (itemKey: string, price: number, emoji: string, name: string, cropKey?: CropKey) => { ok: boolean; msg: string };
  addCoin: (n: number) => void;
  resetAll: () => void;
  /** 供组件在每帧或计时驱动强制刷新（不改状态，仅 bump 版本号） */
  tick: () => void;
  _tickVersion: number;
}

export type GameStore = GameState & GameActions & ToastActions;

let toastId = 0;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...buildInitialState(),
      _tickVersion: 0,
      toasts: [],

      /* -------- Toast -------- */
      pushToast: (msg, kind = 'default') => {
        const id = ++toastId;
        set((s) => ({ toasts: [...s.toasts, { id, msg, kind }] }));
        setTimeout(() => get().dismissToast(id), 1800);
      },
      dismissToast: (id) => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      },

      /* -------- Tick -------- */
      tick: () => set((s) => ({ _tickVersion: s._tickVersion + 1 })),

      /* -------- 种植 -------- */
      plantSeed: (plotId, cropKey) => {
        const state = get();
        const plot = state.plots[plotId];
        if (!plot) return { ok: false, msg: '地块不存在' };
        if (plot.locked) return { ok: false, msg: '地块未解锁' };
        if (plot.cropType) return { ok: false, msg: '这块地已经种过了' };
        const crop = CROP_LIB[cropKey];
        if (!crop) return { ok: false, msg: '种子不存在' };
        if (state.coin < crop.cost) return { ok: false, msg: '金币不足' };

        const nextPlots = state.plots.map<Plot>((p, i) =>
          i === plotId
            ? { ...p, cropType: cropKey, plantedAt: Date.now(), needsWater: false }
            : p,
        );
        set({
          coin: state.coin - crop.cost,
          plots: nextPlots,
          stats: { ...state.stats, planted: state.stats.planted + 1 },
        });
        return { ok: true, msg: `种下 ${crop.name}` };
      },

      /* -------- 浇水 -------- */
      waterPlot: (plotId) => {
        const state = get();
        const plot = state.plots[plotId];
        if (!plot || !plot.cropType) return { ok: false, msg: '这里没有作物' };
        if (!plot.needsWater) return { ok: false, msg: '这块地暂时不需要浇水' };

        const crop = CROP_LIB[plot.cropType];
        // 浇水后作物继续生长（画布逻辑：进度回到 40%）
        const nextPlot: Plot = {
          ...plot,
          needsWater: false,
          plantedAt: Date.now() - crop.durationMs * 0.4,
        };
        const nextPlots = state.plots.map((p, i) => (i === plotId ? nextPlot : p));

        // 推进"浇水"类任务
        const nextTasks = state.tasks.map((t) =>
          t.kind === 'water' && !t.claimed
            ? { ...t, progress: Math.min(t.goal, t.progress + 1) }
            : t,
        );

        set({
          plots: nextPlots,
          tasks: nextTasks,
          stats: { ...state.stats, watered: state.stats.watered + 1 },
        });
        return { ok: true, msg: '浇水成功，作物继续生长' };
      },

      /* -------- 收获 -------- */
      harvestPlot: (plotId) => {
        const state = get();
        const plot = state.plots[plotId];
        if (!plot || !plot.cropType) return { ok: false, msg: '这里没有作物' };
        if (stageOf(plot) !== 'ripe') return { ok: false, msg: '作物还没成熟' };

        const crop = CROP_LIB[plot.cropType];
        const nextPlots = state.plots.map<Plot>((p, i) =>
          i === plotId ? { ...p, cropType: null, plantedAt: 0, needsWater: false } : p,
        );

        // 收获入库（按作物 emoji 归类）
        const invKey = `crop-${plot.cropType}`;
        const existed = state.inventory.find((it) => it.key === invKey);
        const nextInv = existed
          ? state.inventory.map((it) =>
              it.key === invKey ? { ...it, count: it.count + 1 } : it,
            )
          : [
              ...state.inventory,
              {
                key: invKey,
                emoji: crop.emoji,
                name: crop.name,
                count: 1,
                category: 'crop' as const,
              },
            ];

        // 推进"收获"类任务
        const nextTasks = state.tasks.map((t) =>
          t.kind === 'harvest' && !t.claimed
            ? { ...t, progress: Math.min(t.goal, t.progress + 1) }
            : t,
        );

        const nextExp = Math.min(state.expMax, state.exp + crop.exp);
        set({
          coin: state.coin + crop.reward,
          exp: nextExp,
          plots: nextPlots,
          inventory: nextInv,
          tasks: nextTasks,
          stats: { ...state.stats, harvested: state.stats.harvested + 1 },
        });
        return {
          ok: true,
          reward: crop.reward,
          msg: `收获 ${crop.name} +${crop.reward}金 · +${crop.exp}经验`,
        };
      },

      /* -------- 一键收获 -------- */
      harvestAll: () => {
        const state = get();
        let count = 0;
        let totalCoin = 0;
        let totalExp = 0;
        const invMap = new Map(state.inventory.map((it) => [it.key, { ...it }]));

        const nextPlots = state.plots.map<Plot>((p) => {
          if (!p.cropType) return p;
          if (stageOf(p) !== 'ripe') return p;
          const crop = CROP_LIB[p.cropType];
          count += 1;
          totalCoin += crop.reward;
          totalExp += crop.exp;
          const invKey = `crop-${p.cropType}`;
          const existed = invMap.get(invKey);
          if (existed) existed.count += 1;
          else
            invMap.set(invKey, {
              key: invKey,
              emoji: crop.emoji,
              name: crop.name,
              count: 1,
              category: 'crop',
            });
          return { ...p, cropType: null, plantedAt: 0, needsWater: false };
        });

        if (count === 0) return { count: 0, totalCoin: 0, totalExp: 0 };

        const nextTasks = state.tasks.map((t) =>
          t.kind === 'harvest' && !t.claimed
            ? { ...t, progress: Math.min(t.goal, t.progress + count) }
            : t,
        );

        set({
          coin: state.coin + totalCoin,
          exp: Math.min(state.expMax, state.exp + totalExp),
          plots: nextPlots,
          inventory: Array.from(invMap.values()),
          tasks: nextTasks,
          stats: { ...state.stats, harvested: state.stats.harvested + count },
        });
        return { count, totalCoin, totalExp };
      },

      /* -------- 拜访好友 -------- */
      visitFriend: (friendId) => {
        const state = get();
        const friend = state.friends.find((f) => f.id === friendId);
        if (!friend) return { ok: false, msg: '好友不存在' };
        if (!friend.online) return { ok: false, msg: `${friend.name} 目前不在线` };

        const gain = 20 + Math.floor(Math.random() * 15);
        const nextTasks = state.tasks.map((t) =>
          t.kind === 'visit' && !t.claimed
            ? { ...t, progress: Math.min(t.goal, t.progress + 1) }
            : t,
        );
        set({
          coin: state.coin + gain,
          stats: { ...state.stats, visited: state.stats.visited + 1 },
          tasks: nextTasks,
        });
        return { ok: true, msg: `拜访 ${friend.name} 获得 ${gain} 金` };
      },

      /* -------- 领取任务奖励 -------- */
      claimTask: (taskId) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === taskId);
        if (!task) return { ok: false, msg: '任务不存在' };
        if (task.claimed) return { ok: false, msg: '已领取过' };
        if (task.progress < task.goal) return { ok: false, msg: '任务未完成' };

        set({
          coin: state.coin + task.reward,
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, claimed: true } : t)),
        });
        return { ok: true, msg: `领取 +${task.reward} 金币` };
      },

      /* -------- 商店购买 -------- */
      buyShopItem: (itemKey, price, emoji, name, cropKey) => {
        const state = get();
        if (state.coin < price) return { ok: false, msg: '金币不足' };
        const invKey = cropKey ? `seed-${cropKey}` : itemKey;
        const existed = state.inventory.find((it) => it.key === invKey);
        const nextInv = existed
          ? state.inventory.map((it) =>
              it.key === invKey ? { ...it, count: it.count + 1 } : it,
            )
          : [
              ...state.inventory,
              {
                key: invKey,
                emoji,
                name,
                count: 1,
                category: (cropKey ? 'seed' : 'tool') as 'seed' | 'tool',
              },
            ];
        set({ coin: state.coin - price, inventory: nextInv });
        return { ok: true, msg: `购买 ${name}` };
      },

      addCoin: (n) => set((s) => ({ coin: s.coin + n })),

      resetAll: () => set({ ...buildInitialState(), toasts: [], _tickVersion: 0 }),
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Toast 与 tick 版本号不持久化
      partialize: (state) => {
        const { toasts: _t, _tickVersion: _v, ...rest } = state;
        void _t;
        void _v;
        return rest;
      },
    },
  ),
);
