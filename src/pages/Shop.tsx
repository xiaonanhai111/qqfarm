import { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { SHOP_CATEGORIES, SHOP_ITEMS } from '../data/shop';
import { useGameStore } from '../store/gameStore';
import type { ShopItem } from '../types';

/**
 * 商店页面
 * - 分类 tabs 切换
 * - 商品网格：点击"购买"扣金币入库
 * - 顶部金币芯片
 */
export default function Shop() {
  const coin = useGameStore((s) => s.coin);
  const buy = useGameStore((s) => s.buyShopItem);
  const pushToast = useGameStore((s) => s.pushToast);
  const [cat, setCat] = useState<ShopItem['category']>('seeds');

  const items = SHOP_ITEMS.filter((it) => it.category === cat);

  const handleBuy = (it: ShopItem) => {
    const r = buy(it.key, it.price, it.emoji, it.name, it.cropKey);
    pushToast(r.msg, r.ok ? 'info' : 'danger');
  };

  return (
    <>
      <TopBar
        title="商店"
        showBack
        right={
          <span className="coin-chip">
            <span className="yuan">¥</span>
            {coin.toLocaleString()}
          </span>
        }
      />

      <div className="cat-tabs" role="tablist">
        {SHOP_CATEGORIES.map((c) => (
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

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">🈳</div>
          <div className="empty-title">该分类暂无商品</div>
          <div className="empty-desc">试试切换其他分类</div>
        </div>
      ) : (
        <div className="goods-grid">
          {items.map((it) => {
            const disabled = coin < it.price;
            return (
              <article key={it.key} className="good-card">
                <div className="good-header">{it.emoji}</div>
                <div className="good-body">
                  <div className="good-name">{it.name}</div>
                  <div className="good-time">⏱ {it.desc}</div>
                  <div className="good-price-row">
                    <span className="good-price">
                      <span className="coin-dot">¥</span>
                      {it.price}
                    </span>
                    <button
                      type="button"
                      className="buy-btn"
                      data-disabled={disabled ? 'true' : 'false'}
                      disabled={disabled}
                      onClick={() => handleBuy(it)}
                    >
                      {disabled ? '不足' : '购买'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
