import { CROP_LIB } from '../data/crops';
import type { Plot, PlotStage } from '../types';

/** 根据 plot 与当前时间戳懒计算生长阶段 */
export function stageOf(plot: Plot, now: number = Date.now()): PlotStage {
  if (plot.locked) return 'locked';
  if (!plot.cropType) return 'empty';
  if (plot.needsWater) return 'withered';
  const crop = CROP_LIB[plot.cropType];
  const elapsed = now - plot.plantedAt;
  const p = elapsed / crop.durationMs;
  if (p >= 1) return 'ripe';
  if (p < 0.35) return 'sprout';
  return 'grow';
}

/** 生长进度 0 ~ 1 */
export function progressOf(plot: Plot, now: number = Date.now()): number {
  if (!plot.cropType) return 0;
  const crop = CROP_LIB[plot.cropType];
  return Math.min(1, Math.max(0, (now - plot.plantedAt) / crop.durationMs));
}

/** 距成熟剩余秒数 */
export function remainSecondsOf(plot: Plot, now: number = Date.now()): number {
  if (!plot.cropType) return 0;
  const crop = CROP_LIB[plot.cropType];
  const remain = crop.durationMs - (now - plot.plantedAt);
  return Math.max(0, Math.ceil(remain / 1000));
}
