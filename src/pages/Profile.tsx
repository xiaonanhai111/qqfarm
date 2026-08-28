import { TopBar } from '../components/TopBar';
import { useGameStore } from '../store/gameStore';

/**
 * 我的页面
 * - 展示玩家等级 / 头像 / 统计数据
 * - 设置项：清空存档、金币模拟充值（原型）
 */
export default function Profile() {
  const level = useGameStore((s) => s.level);
  const exp = useGameStore((s) => s.exp);
  const expMax = useGameStore((s) => s.expMax);
  const stats = useGameStore((s) => s.stats);
  const coin = useGameStore((s) => s.coin);
  const addCoin = useGameStore((s) => s.addCoin);
  const resetAll = useGameStore((s) => s.resetAll);
  const pushToast = useGameStore((s) => s.pushToast);

  const pct = Math.min(100, Math.round((exp / expMax) * 100));

  const handleReset = () => {
    if (window.confirm('确定要清空存档并重新开始吗？此操作不可撤销。')) {
      resetAll();
      pushToast('存档已重置', 'info');
    }
  };

  return (
    <>
      <TopBar title="我的" showBack={false} />

      <section className="profile-hero" aria-label="玩家资料">
        <div className="profile-avatar">🧑‍🌾</div>
        <div>
          <div className="profile-name">农场主 · {coin >= 10000 ? '土豪村长' : '新手农夫'}</div>
          <div className="profile-level">
            Lv.{level} · {exp}/{expMax} 经验 ({pct}%)
          </div>
        </div>
      </section>

      <section className="profile-stats" aria-label="统计">
        <div className="stat-card">
          <div className="stat-value">{stats.harvested}</div>
          <div className="stat-label">累计收获</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.watered}</div>
          <div className="stat-label">累计浇水</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.visited}</div>
          <div className="stat-label">拜访好友</div>
        </div>
      </section>

      <section className="setting-list" aria-label="设置">
        <button
          type="button"
          className="setting-item"
          onClick={() => {
            addCoin(500);
            pushToast('金币 +500（模拟充值）', 'info');
          }}
          style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left' }}
        >
          <div className="setting-left">
            <span className="setting-icon">💰</span>
            模拟充值 +500
          </div>
          <span className="setting-arrow">›</span>
        </button>
        <button
          type="button"
          className="setting-item"
          onClick={() => pushToast('PWA 已启用，可从浏览器菜单添加到主屏', 'info')}
          style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left' }}
        >
          <div className="setting-left">
            <span className="setting-icon">📱</span>
            安装到手机主屏
          </div>
          <span className="setting-arrow">›</span>
        </button>
        <button
          type="button"
          className="setting-item"
          onClick={() => pushToast('已同步本地时间', 'info')}
          style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left' }}
        >
          <div className="setting-left">
            <span className="setting-icon">⏰</span>
            同步系统时间
          </div>
          <span className="setting-arrow">›</span>
        </button>
        <button
          type="button"
          className="setting-item"
          onClick={handleReset}
          style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left', color: 'hsl(0 72% 45%)' }}
        >
          <div className="setting-left">
            <span className="setting-icon" style={{ background: 'hsl(0 65% 92%)', color: 'hsl(0 72% 45%)' }}>
              🗑
            </span>
            清空存档
          </div>
          <span className="setting-arrow">›</span>
        </button>
      </section>

      <div style={{ textAlign: 'center', padding: '20px 14px 40px', color: 'hsl(130 15% 55%)', fontSize: 11 }}>
        QQ 农场 · React + PWA 版 · v1.0
      </div>
    </>
  );
}
