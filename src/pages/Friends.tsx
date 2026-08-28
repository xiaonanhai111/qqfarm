import { TopBar } from '../components/TopBar';
import { useGameStore } from '../store/gameStore';

/**
 * 好友页面
 * - 展示 NPC 好友列表（原型阶段无真实社交，纯本地模拟）
 * - 点击「拜访」获得少量金币并推进相关任务
 */
export default function Friends() {
  const friends = useGameStore((s) => s.friends);
  const visitFriend = useGameStore((s) => s.visitFriend);
  const pushToast = useGameStore((s) => s.pushToast);

  const onlineCount = friends.filter((f) => f.online).length;

  return (
    <>
      <TopBar
        title="好友"
        showBack
        right={
          <span
            className="coin-chip"
            style={{
              background: 'linear-gradient(180deg, hsl(200 80% 60%), hsl(210 75% 45%))',
              boxShadow: '0 3px 0 hsl(210 75% 28%)',
              borderColor: 'hsl(200 80% 78%)',
            }}
          >
            <span className="yuan" style={{ background: 'hsl(200 80% 82%)', color: 'hsl(210 75% 28%)' }}>
              在线
            </span>
            {onlineCount}
          </span>
        }
      />

      <div className="friend-list">
        {friends.map((f) => (
          <div key={f.id} className="friend-card">
            <div className="friend-avatar">{f.emoji}</div>
            <div className="friend-info">
              <div className="friend-name">
                {f.name}
                <span
                  style={{
                    display: 'inline-block',
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    marginLeft: 6,
                    background: f.online ? 'hsl(130 55% 45%)' : 'hsl(130 10% 60%)',
                  }}
                  aria-label={f.online ? '在线' : '离线'}
                />
              </div>
              <div className="friend-desc">{f.desc}</div>
            </div>
            <button
              type="button"
              className="friend-visit-btn"
              onClick={() => {
                const r = visitFriend(f.id);
                pushToast(r.msg, r.ok ? 'info' : 'warn');
              }}
              disabled={!f.online}
              style={!f.online ? { opacity: 0.55 } : undefined}
            >
              {f.online ? '拜访' : '离线'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
