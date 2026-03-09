/**
 * Iconfont 图标配置
 * 图标来源：https://www.iconfont.cn/search/index?searchType=icon&q=扑克
 *
 * 使用步骤：
 * 1. 打开上述链接，登录 iconfont.cn
 * 2. 将需要的图标加入购物车，创建项目并生成 Symbol 或 Font class 链接
 * 3. 在 .env 中设置 VITE_ICONFONT_SCRIPT_URL（Symbol 模式）或使用下方默认占位
 * 4. 确保项目中的图标 name 与下面 ICON_NAMES 中使用的 id 一致
 */
const scriptUrl =
  typeof import.meta.env !== 'undefined' && import.meta.env.VITE_ICONFONT_SCRIPT_URL
    ? String(import.meta.env.VITE_ICONFONT_SCRIPT_URL)
    : ''

export function getIconfontScriptUrl(): string {
  return scriptUrl
}

/** 项目内使用的图标语义名 → iconfont 中的 symbol id（不含 #） */
export const ICON_NAMES = {
  dashboard: 'icon-dashboard',
  clock: 'icon-clock',
  trending: 'icon-trending',
  compare: 'icon-compare',
  settings: 'icon-settings',
  search: 'icon-search',
  bell: 'icon-bell',
  grid: 'icon-grid',
  activity: 'icon-activity',
  'arrow-right': 'icon-arrow-right',
  star: 'icon-star',
  'arrow-left': 'icon-arrow-left',
  gauge: 'icon-gauge',
  brain: 'icon-brain',
  database: 'icon-database',
  check: 'icon-check',
  cloud: 'icon-cloud',
  harddrive: 'icon-harddrive',
  eye: 'icon-eye',
  heart: 'icon-heart',
  sliders: 'icon-sliders',
  tag: 'icon-tag',
  user: 'icon-user',
  plus: 'icon-plus',
} as const

export type IconfontName = keyof typeof ICON_NAMES
