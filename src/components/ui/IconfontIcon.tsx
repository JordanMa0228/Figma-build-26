import { cn } from '../../lib/utils'
import { ICON_NAMES, getIconfontScriptUrl, type IconfontName } from '../../lib/iconfont'
import {
  LayoutDashboard, Clock, TrendingUp, GitCompare, Settings, Search,
  Bell, Grid3X3, Activity, ArrowRight, Star, ArrowLeft, Gauge,
  Brain, Database, Check, Cloud, HardDrive, Eye, Heart, Sliders,
  Tag, User, Plus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface IconfontIconProps {
  /** 语义化图标名，对应 iconfont 项目中的 symbol id */
  name: IconfontName
  size?: number
  className?: string
}

const LUCIDE_FALLBACK: Record<IconfontName, LucideIcon> = {
  dashboard: LayoutDashboard,
  clock: Clock,
  trending: TrendingUp,
  compare: GitCompare,
  settings: Settings,
  search: Search,
  bell: Bell,
  grid: Grid3X3,
  activity: Activity,
  'arrow-right': ArrowRight,
  star: Star,
  'arrow-left': ArrowLeft,
  gauge: Gauge,
  brain: Brain,
  database: Database,
  check: Check,
  cloud: Cloud,
  harddrive: HardDrive,
  eye: Eye,
  heart: Heart,
  sliders: Sliders,
  tag: Tag,
  user: User,
  plus: Plus,
}

const iconfontLoaded = !!getIconfontScriptUrl()

/**
 * 使用 iconfont.cn 矢量图标（来源：扑克 搜索）
 * 需在 .env 中配置 VITE_ICONFONT_SCRIPT_URL 指向你的 iconfont Symbol 脚本
 * 若未配置则回退到 Lucide React 图标
 */
export function IconfontIcon({ name, size = 24, className }: IconfontIconProps) {
  if (!iconfontLoaded) {
    const LucideIconComponent = LUCIDE_FALLBACK[name]
    if (LucideIconComponent) {
      return <LucideIconComponent size={size} className={cn('inline-block shrink-0', className)} aria-hidden />
    }
  }

  const symbolId = ICON_NAMES[name]
  return (
    <svg
      className={cn('inline-block shrink-0 fill-current', className)}
      width={size}
      height={size}
      aria-hidden
    >
      <use href={`#${symbolId}`} />
    </svg>
  )
}
