import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig } from '@/config/site'
import { cn } from '@/utils'

interface LogoProps {
  className?: string
  /** Use light text for dark backgrounds. */
  inverted?: boolean
  onClick?: () => void
}

export function Logo({ className, inverted, onClick }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn('inline-flex items-center gap-2 rounded-lg', className)}
      aria-label={`${siteConfig.name} — home`}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-700 text-accent-400">
        <Leaf className="size-5" aria-hidden="true" />
      </span>
      <span
        className={cn(
          'text-lg font-bold tracking-tight',
          inverted ? 'text-white' : 'text-stone-900',
        )}
      >
        Fresh <span className="text-accent-500">&amp;</span> Good
      </span>
    </Link>
  )
}
