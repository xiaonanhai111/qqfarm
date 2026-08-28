import { NavLink } from 'react-router-dom';

const TABS: Array<{ to: string; label: string; emoji: string; end?: boolean }> = [
  { to: '/',          label: '农场', emoji: '🌾', end: true },
  { to: '/shop',      label: '商店', emoji: '🛒' },
  { to: '/warehouse', label: '仓库', emoji: '📦' },
  { to: '/friends',   label: '好友', emoji: '👥' },
  { to: '/profile',   label: '我的', emoji: '👤' },
];

export function TabBar() {
  return (
    <nav className="farm-nav" role="tablist">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className="farm-nav-item"
          style={({ isActive }) => (isActive ? undefined : undefined)}
        >
          {({ isActive }) => (
            <>
              <span className="nav-icon" data-active={isActive ? 'true' : 'false'}>
                {t.emoji}
              </span>
              <span className="nav-label" style={{ color: isActive ? 'hsl(130 60% 32%)' : undefined }}>
                {t.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
