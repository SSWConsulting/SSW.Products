'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number
  duration?: number
  shineColor?: string | string[]
  excludeTop?: boolean
}

export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = '#000000',
  excludeTop = false,
  className,
  style,
  ...props
}: ShineBorderProps) {
  const gradient = Array.isArray(shineColor)
    ? shineColor.join(',')
    : shineColor

  const baseMask = 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)'

  const excludeTopMask = `linear-gradient(to bottom, transparent ${borderWidth}px, #fff ${borderWidth}px) content-box, linear-gradient(#fff 0 0)`

  return (
    <div
      style={
        {
          '--border-width': `${borderWidth}px`,
          '--duration': `${duration}s`,
          backgroundImage: `radial-gradient(transparent, transparent, ${gradient}, transparent, transparent)`,
          backgroundSize: '300% 300%',
          mask: excludeTop ? excludeTopMask : baseMask,
          WebkitMask: excludeTop ? excludeTopMask : baseMask,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: excludeTop
            ? `0 var(--border-width) var(--border-width) var(--border-width)`
            : `var(--border-width)`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position] motion-safe:animate-shine',
        className
      )}
      {...props}
    />
  )
}
