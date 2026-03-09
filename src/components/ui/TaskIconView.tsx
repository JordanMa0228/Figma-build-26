import { PokerIcon } from './PokerIcon'
import { CodingIcon } from './CodingIcon'
import { ClassIcon } from './ClassIcon'
import { EmailIcon } from './EmailIcon'
import { MusicIcon } from './MusicIcon'
import { LightbulbIcon } from './LightbulbIcon'
import { MoonIcon } from './MoonIcon'

const EMOJI_TO_ICON = {
  '💻': CodingIcon,
  '🃏': PokerIcon,
  '📚': ClassIcon,
  '📧': EmailIcon,
  '🎵': MusicIcon,
  '💡': LightbulbIcon,
  '🌙': MoonIcon,
} as const

interface TaskIconViewProps {
  icon: string
  className?: string
  size?: number
}

/**
 * Renders task type icon: SVG for known task types, emoji fallback for others.
 * Coding→技术分析, Poker→扑克, Class→课堂, Email→邮件, Music→音乐.
 */
export function TaskIconView({ icon, className, size = 24 }: TaskIconViewProps) {
  const IconComponent = EMOJI_TO_ICON[icon as keyof typeof EMOJI_TO_ICON]
  if (IconComponent) {
    return <IconComponent size={size} className={className} />
  }
  return <span className={className} style={{ fontSize: size ? `${size}px` : undefined }}>{icon}</span>
}
