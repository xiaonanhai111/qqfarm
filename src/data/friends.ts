import type { Friend } from '../types';

/** NPC 好友列表（原型阶段用假数据） */
export const FRIENDS_INITIAL: Friend[] = [
  { id: 'f1', name: '小明', emoji: '👦', desc: '农场 Lv.25 · 有 3 块成熟作物', level: 25, online: true },
  { id: 'f2', name: '小红', emoji: '👧', desc: '农场 Lv.32 · 5 分钟前上线', level: 32, online: true },
  { id: 'f3', name: '大叔', emoji: '👨', desc: '农场 Lv.40 · 果园大师', level: 40, online: false },
  { id: 'f4', name: '奶奶', emoji: '👵', desc: '农场 Lv.28 · 花卉爱好者', level: 28, online: true },
  { id: 'f5', name: '牛仔', emoji: '🤠', desc: '农场 Lv.35 · 昨日拜访过你', level: 35, online: false },
  { id: 'f6', name: '厨师', emoji: '👨‍🍳', desc: '农场 Lv.30 · 番茄专业户', level: 30, online: true },
];
