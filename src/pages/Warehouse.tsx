import { useMemo, useState } from 'react';
import { TopBar } from '../components/TopBar';
import { useGameStore } from '../store/gameStore';
import type { InventoryItem } from '../types';

type WHCategory = 'all' | 'crop' | 'seed' | 'tool';

const CAT_LIST: Array<{ key: WHCategory; label: string; emoji: string }> = [
  { key: 'all',  label: '全部', emoji: '📦' },
  { key: 'crop', label: '作物', emoji: '🌾' },
  { key: 'seed', label: '种子', emoji: '🌱' },
  { key: 'tool', label: '道具', emoji: '🛠️' },
];

/**
 * 仓库页面
 * - 展示所有已收获作物、已购买种子、道具
 * - 支持按分类筛选
 */
export default function Warehouse() {
  const inventory = useGameStore((s) => s.inventory);
  const [cat, setCat] = useState<WHCategory>('all');

  const list: InventoryItem[] = useMemo(
    () => (cat === 'all' ? inventory : inventory.filter((it) => it.category === cat)),
    [inventory, cat],
  );

  const totalCount = inventory.reduce((sum, it) => sum + it.count, 0);

  return (
    <>
      <TopBar
        title="仓库"
        showBack
        right={
          <span className="coin-chip" style={{ background: 'linear-gradient(180deg, hsl(130 60% 55%), hsl(130 60% 42%))', boxShadow: '0 3px 0 hsl(130 60% 28%)', borderColor: 'hsl(130 45% 78%)' }}>
            <span className="yuan" style={{ background: 'hsl(130 45% 82%)', color: 'hsl(130 60% 28%)' }}>📦</span>
            {totalCount}
          </span>
        }
      />

      <div className="wh-tabs" role="tablist">
        {CAT_LIST.map((c) => (
          <button
            key={c.key}
            type="button"
            className="cat-tab"
            data-active={cat === c.key ? 'true' : 'false'}
            onClick={() => setCat(c.key)}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">📭</div>
          <div className="empty-title">仓库空空如也</div>
          <div className="empty-desc">去农场收获点作物吧</div>
        </div>
      ) : (
        <div className="wh-grid">
          {list.map((it) => (
            <div key={it.key} className="wh-card">
              <div className="wh-emoji">{it.emoji}</div>
              <div className="wh-name">{it.name}</div>
              <span className="wh-count">{it.count}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
