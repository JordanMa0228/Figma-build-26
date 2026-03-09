import { cn } from '../../lib/utils'
import { ICON_NAMES, getIconfontScriptUrl, type IconfontName } from '../../lib/iconfont'

interface IconfontIconProps {
  /** 语义化图标名，对应 iconfont 项目中的 symbol id */
  name: IconfontName
  size?: number
  className?: string
}

/**
 * 使用 iconfont.cn 矢量图标（来源：扑克 搜索）
 * 需在 .env 中配置 VITE_ICONFONT_SCRIPT_URL 指向你的 iconfont Symbol 脚本
 */
export function IconfontIcon({ name, size = 24, className }: IconfontIconProps) {
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
