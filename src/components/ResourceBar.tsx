import { useGameStore } from '../store/gameStore';

export function ResourceBar() {
  const coin = useGameStore((s) => s.coin);
  const exp = useGameStore((s) => s.exp);
  const expMax = useGameStore((s) => s.expMax);
  const level = useGameStore((s) => s.level);
  const energy = useGameStore((s) => s.energy);

  const pct = Math.min(100, Math.round((exp / expMax) * 100));

  return (
    <section className="farm-resources">
      <div className="farm-resource-card">
        <span className="res-icon coin">¥</span>
        <div className="res-info">
          <div className="res-label">金币</div>
          <div className="res-value">{coin.toLocaleString()}</div>
        </div>
      </div>
      <div className="farm-resource-card">
        <span className="res-icon exp">Lv</span>
        <div className="res-info">
          <div className="res-label">Lv.{level}</div>
          <div className="exp-bar" aria-label={`经验 ${pct}%`}>
            <div className="exp-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <div className="farm-resource-card">
        <span className="res-icon energy">♥</span>
        <div className="res-info">
          <div className="res-label">体力</div>
          <div className="res-value">{energy}</div>
        </div>
      </div>
    </section>
  );
}
