import { CROP_LIB, ALL_CROP_KEYS } from '../data/crops';
import { useGameStore } from '../store/gameStore';

interface Props {
  plotId: number | null;
  onClose: () => void;
}

export function SeedModal({ plotId, onClose }: Props) {
  const coin = useGameStore((s) => s.coin);
  const plantSeed = useGameStore((s) => s.plantSeed);
  const pushToast = useGameStore((s) => s.pushToast);

  if (plotId === null) return null;

  return (
    <div className="farm-modal" onClick={onClose}>
      <div className="farm-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <span>选择种子</span>
          <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        <div className="seed-grid">
          {ALL_CROP_KEYS.map((key) => {
            const crop = CROP_LIB[key];
            const disabled = coin < crop.cost;
            return (
              <button
                key={key}
                type="button"
                className="seed-item"
                data-disabled={disabled ? 'true' : 'false'}
                disabled={disabled}
                onClick={() => {
                  const r = plantSeed(plotId, key);
                  pushToast(r.msg, r.ok ? 'info' : 'danger');
                  if (r.ok) onClose();
                }}
              >
                <div className="seed-emoji">{crop.emoji}</div>
                <div className="seed-name">{crop.name}</div>
                <div className="seed-cost">
                  <span
                    style={{
                      display: 'inline-flex',
                      width: 13,
                      height: 13,
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, hsl(45 100% 65%), hsl(38 90% 50%))',
                      color: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 900,
                    }}
                  >
                    ¥
                  </span>
                  {crop.cost}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
