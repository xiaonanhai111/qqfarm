import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  /** 是否显示返回按钮（默认 false，首页/主 Tab 不显示） */
  showBack?: boolean;
  /** 右侧扩展槽 */
  right?: React.ReactNode;
}

export function TopBar({ title, showBack, right }: Props) {
  const nav = useNavigate();
  return (
    <header className="farm-topbar">
      {showBack ? (
        <button type="button" className="top-btn" onClick={() => nav(-1)} aria-label="返回">
          ‹
        </button>
      ) : (
        <span className="top-btn" aria-hidden style={{ visibility: 'hidden' }} />
      )}
      <div className="top-title">{title}</div>
      <div style={{ display: 'flex', gap: 6 }}>{right ?? <span className="top-btn" aria-hidden style={{ visibility: 'hidden' }} />}</div>
    </header>
  );
}
