import { useGameStore } from '../store/gameStore';

export function ToastHost() {
  const toasts = useGameStore((s) => s.toasts);
  return (
    <div className="toast-host">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`farm-toast${t.kind && t.kind !== 'default' ? ` farm-toast-${t.kind}` : ''}`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
