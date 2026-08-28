import type { ShopItem } from '../types';

/**
 * 商店商品列表
 * 种子类商品的 cropKey 用于从 CROP_LIB 查询实际种植参数
 */
export const SHOP_ITEMS: ShopItem[] = [
  { key: 'seed-carrot',    emoji: '🥕', name: '胡萝卜种子', desc: '8 秒成熟',  price: 50,  category: 'seeds', cropKey: 'carrot' },
  { key: 'seed-tomato',    emoji: '🍅', name: '番茄种子',   desc: '12 秒成熟', price: 80,  category: 'seeds', cropKey: 'tomato' },
  { key: 'seed-corn',      emoji: '🌽', name: '玉米种子',   desc: '15 秒成熟', price: 120, category: 'seeds', cropKey: 'corn' },
  { key: 'seed-wheat',     emoji: '🌾', name: '小麦种子',   desc: '10 秒成熟', price: 60,  category: 'seeds', cropKey: 'wheat' },
  { key: 'seed-strawberry',emoji: '🍓', name: '草莓种子',   desc: '18 秒成熟', price: 150, category: 'seeds', cropKey: 'strawberry' },
  { key: 'seed-flower',    emoji: '🌸', name: '花朵种子',   desc: '20 秒成熟', price: 200, category: 'flowers', cropKey: 'flower' },
  { key: 'tool-water',     emoji: '💧', name: '大水壶',     desc: '一键浇水', price: 300, category: 'tools' },
  { key: 'decor-fence',    emoji: '🪵', name: '木栅栏',     desc: '装饰农场', price: 500, category: 'decor' },
];

export const SHOP_CATEGORIES: Array<{ key: ShopItem['category']; label: string; emoji: string }> = [
  { key: 'seeds',   label: '种子', emoji: '🌱' },
  { key: 'flowers', label: '花卉', emoji: '🌸' },
  { key: 'tools',   label: '工具', emoji: '🛠️' },
  { key: 'decor',   label: '装饰', emoji: '🎨' },
];
