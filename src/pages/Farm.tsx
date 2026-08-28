import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CROP_LIB } from '../data/crops';
import { stageOf, progressOf, remainSecondsOf } from '../utils/plot';
import type { Plot } from '../types';
import { TopBar } from '../components/TopBar';
import { ResourceBar } from '../components/ResourceBar';
import { SeedModal } from '../components/SeedModal';

/**
 * 农场主页
 * - 12 格农田网格：点击空地弹种子选择；点击成熟收获；点击枯萎浇水
 * - 快捷操作栏：播种 / 浇水 / 除虫 / 收获 / 加速（仅切换提示）
 * - 每日任务：领取奖励
 * - 悬浮按钮：一键收获
 */
export default function Farm() {
  const plots = useGameStore((s) => s.plots);
  const tasks = useGameStore((s) => s.tasks);
  const _tick = useGameStore((s) => s._tickVersion);
  const tick = useGameStore((s) => s.tick);
  const waterPlot = useGameStore((s) => s.waterPlot);
  const harvestPlot = useGameStore((s) => s.harvestPlot);
  const harvestAll = useGameStore((s) => s.harvestAll);
  const claimTask = useGameStore((s) => s.claimTask);
  const pushToast = useGameStore((s) => s.pushToast);

  const [activePlot, setActivePlot] = useState<number | null>(null);
  const [action, setAction] = useState<'plant' | 'water' | 'pest' | 'harvest' | 'speed'>('plant');

  /* 每秒 tick 让生长进度自然更新 */
  useEffect(() => {
    const timer = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(timer);
  }, [tick]);

  /* 农田统计 */
  const summary = useMemo(() => {
    let ripe = 0, water = 0, growing = 0;
    plots.forEach((p) => {
      const s = stageOf(p);
      if (s === 'ripe') ripe++;
      else if (s === 'withered') water++;
      else if (s === 'sprout' || s === 'grow') growing++;
    });
    return { ripe, water, growing };
  }, [plots, _tick]);

  const handlePlotClick = (plot: Plot) => {
    const s = stageOf(plot);
    if (s === 'locked') {
      pushToast(plot.lockLevel ? `需达到 Lv.${plot.lockLevel} 才可解锁` : '需消耗钻石解锁', 'warn');
      return;
    }
    if (s === 'withered') {
      const r = waterPlot(plot.id);
      pushToast(r.msg, r.ok ? 'info' : 'warn');
      return;
    }
    if (s === 'ripe') {
      const r = harvestPlot(plot.id);
      pushToast(r.msg, r.ok ? 'default' : 'warn');
      return;
    }
    if (s === 'empty') {
      setActivePlot(plot.id);
      return;
    }
    // 生长中
    const crop = plot.cropType ? CROP_LIB[plot.cropType] : null;
    const remain = remainSecondsOf(plot);
    pushToast(`${crop?.emoji ?? ''} ${crop?.name ?? ''} · 还需 ${remain} 秒`, 'info');
  };

  const handleAction = (k: typeof action, label: string) => {
    setAction(k);
    pushToast(`已切换到「${label}」模式`, 'info');
  };

  const handleHarvestAll = () => {
    const r = harvestAll();
    if (r.count === 0) {
      pushToast('目前没有可收获的作物', 'warn');
      return;
    }
    pushToast(`一键收获 ${r.count} 个 · +${r.totalCoin}金 · +${r.totalExp}经验`);
  };

  const handleClaim = (taskId: string) => {
    const r = claimTask(taskId);
    pushToast(r.msg, r.ok ? 'default' : 'warn');
  };

  return (
    <>
      <TopBar title="我的农场" showBack={false} />
      <ResourceBar />

      {/* 农田网格 */}
      <section className="farm-field-wrap">
        <div className="farm-field-head">
          <span className="farm-field-title">🌱 我的农田</span>
          <span style={{ fontSize: 11, color: 'hsl(130 15% 45%)', fontWeight: 700 }}>
            {summary.ripe} 待收获 · {summary.water} 需浇水 · {summary.growing} 生长中
          </span>
        </div>
        <div className="farm-field-grid">
          {plots.map((plot) => {
            const s = stageOf(plot);
            const p = Math.round(progressOf(plot) * 100);
            const cls = ['farm-plot'];
            if (s === 'locked') cls.push('farm-plot-lock');
            else if (s === 'empty') cls.push('farm-plot-empty');
            else if (s === 'withered') cls.push('farm-plot-withered');
            else if (s === 'sprout') cls.push('farm-plot-sprout');
            else if (s === 'grow') cls.push('farm-plot-grow');
            else if (s === 'ripe') cls.push('farm-plot-ripe');
            const crop = plot.cropType ? CROP_LIB[plot.cropType] : null;

            return (
              <button
                key={plot.id}
                type="button"
                className={cls.join(' ')}
                onClick={() => handlePlotClick(plot)}
                aria-label={`地块 ${plot.id + 1}`}
                style={{ border: 'none', padding: 0 }}
              >
                {s === 'locked' && (
                  <span style={{ fontSize: 20 }}>🔒{plot.lockLevel ? <sub style={{ fontSize: 9 }}>Lv{plot.lockLevel}</sub> : null}</span>
                )}
                {s === 'withered' && (
                  <>
                    <span className="farm-plot-badge" style={{ background: 'hsl(38 95% 55%)' }}>浇水</span>
                    <span>🥀</span>
                  </>
                )}
                {s === 'sprout' && (
                  <>
                    <span className="farm-progress-ring">{p}%</span>
                    <span>🌱</span>
                  </>
                )}
                {s === 'grow' && (
                  <>
                    <span className="farm-progress-ring">{p}%</span>
                    <span>{crop?.emoji ?? '🌿'}</span>
                  </>
                )}
                {s === 'ripe' && (
                  <>
                    <span className="farm-plot-badge">可收获</span>
                    <span>{crop?.emoji ?? '🥕'}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 快捷操作 */}
      <section className="farm-action-bar" aria-label="快捷操作">
        {[
          { k: 'plant',   emoji: '🌱', label: '播种' },
          { k: 'water',   emoji: '💧', label: '浇水' },
          { k: 'pest',    emoji: '🐛', label: '除虫' },
          { k: 'harvest', emoji: '🌾', label: '收获' },
          { k: 'speed',   emoji: '⚡', label: '加速' },
        ].map((it) => (
          <button
            key={it.k}
            type="button"
            className="farm-action-btn"
            data-kind={it.k}
            data-active={action === it.k ? 'true' : 'false'}
            onClick={() => handleAction(it.k as typeof action, it.label)}
          >
            <span className="action-icon">{it.emoji}</span>
            <span className="action-label">{it.label}</span>
          </button>
        ))}
      </section>

      {/* 每日任务 */}
      <section className="farm-task" aria-label="每日任务">
        <div className="task-head">
          <span className="task-head-title">📋 每日任务</span>
          <span className="task-head-count">
            {tasks.filter((t) => t.claimed).length}/{tasks.length}
          </span>
        </div>
        {tasks.map((t) => {
          const done = t.progress >= t.goal;
          return (
            <div key={t.id} className="task-item">
              <div className="task-info">
                <div className="task-text">{t.text}</div>
                <div className="task-progress-bar">
                  <div
                    className="task-progress-fill"
                    style={{ width: `${Math.min(100, (t.progress / t.goal) * 100)}%` }}
                  />
                </div>
                <div className="task-progress-text">
                  {t.progress}/{t.goal} · 奖励 {t.reward} 金
                </div>
              </div>
              <button
                type="button"
                className="task-btn"
                data-disabled={!done && !t.claimed ? 'true' : 'false'}
                data-claimed={t.claimed ? 'true' : 'false'}
                onClick={() => handleClaim(t.id)}
                disabled={t.claimed || !done}
              >
                {t.claimed ? '已领取' : done ? '领取' : '进行中'}
              </button>
            </div>
          );
        })}
      </section>

      {/* 一键收获 FAB */}
      <button
        type="button"
        className="farm-fab"
        onClick={handleHarvestAll}
        aria-label="一键收获"
      >
        🌾
        {summary.ripe > 0 && <span className="farm-fab-badge">{summary.ripe}</span>}
      </button>

      <SeedModal plotId={activePlot} onClose={() => setActivePlot(null)} />
    </>
  );
}
