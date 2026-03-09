import type { SVGProps } from 'react'

interface EmailIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * Vector icon for Email / 邮件 task type (replaces 📧 emoji).
 * Source: 邮件.svg
 */
export function EmailIcon({ size = 24, className, ...props }: EmailIconProps) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      {...props}
    >
      <path d="M780.8 341.333333H243.2l268.8 149.333334v85.333333L213.333333 409.6V682.666667h597.333334V409.6l-298.666667 166.4v-85.333333L780.8 341.333333zM896 256v512H128V256h768z" />
    </svg>
  )
}
