import type { SVGProps } from 'react'

interface CodingIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * Vector icon for Coding / 技术分析 task type (replaces 💻 emoji).
 * Source: 技术分析.svg
 */
export function CodingIcon({ size = 24, className, ...props }: CodingIconProps) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      {...props}
    >
      <path d="M896 128H128c-38.4 0-64 25.6-64 64v512c0 38.4 25.6 64 64 64h256v128h-96c-19.2 0-32 12.8-32 32s12.8 32 32 32h448c19.2 0 32-12.8 32-32s-12.8-32-32-32h-96V768h256c38.4 0 64-25.6 64-64V192c0-38.4-25.6-64-64-64zM448 896V768h128v128H448z m448-192H128V192h768v512z" />
      <path d="M345.6 563.2c6.4 6.4 12.8 6.4 25.6 6.4s19.2 0 25.6-6.4c12.8-12.8 12.8-32 0-44.8L320 448l70.4-70.4c12.8-12.8 12.8-32 0-44.8s-38.4-12.8-44.8 0l-96 89.6c-12.8 12.8-12.8 32 0 44.8l96 96z m288 0c6.4 6.4 12.8 6.4 25.6 6.4s19.2 0 25.6-6.4l89.6-89.6c12.8-12.8 12.8-32 0-44.8l-89.6-89.6c-12.8-19.2-38.4-19.2-51.2-6.4s-12.8 32 0 44.8L704 448l-70.4 70.4c-12.8 12.8-12.8 32 0 44.8zM448 576c12.8 0 19.2-6.4 25.6-12.8l128-192c12.8-12.8 6.4-32-6.4-44.8-19.2-12.8-38.4-6.4-44.8 6.4l-128 192c-12.8 19.2-6.4 38.4 6.4 44.8 6.4 6.4 12.8 6.4 19.2 6.4z" />
    </svg>
  )
}
