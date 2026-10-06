import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'icon'

interface StyleProps {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900',
  secondary: 'bg-accent-400 text-stone-900 shadow-sm hover:bg-accent-500 active:bg-accent-600',
  outline:
    'border border-brand-700 bg-transparent text-brand-700 hover:bg-brand-50 active:bg-brand-100',
  ghost: 'bg-transparent text-stone-700 hover:bg-stone-100 active:bg-stone-200',
  /** Tinted pill, used for filter chips and tag links. */
  soft: 'bg-brand-50 text-brand-800 hover:bg-brand-100 active:bg-brand-200',
}

const sizeClasses: Record<Size, string> = {
  xs: 'h-8 px-3 text-xs gap-1',
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-10 w-10 p-0',
}

function buttonClasses(
  { variant = 'primary', size = 'md', fullWidth }: StyleProps,
  className?: string,
) {
  return cn(
    'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
    'disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {
  ref?: Ref<HTMLButtonElement>
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth }, className)}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}

interface ButtonLinkProps extends LinkProps, StyleProps {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

/** A router `Link` styled as a button. */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, fullWidth }, className)} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  )
}

interface ButtonAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement>, StyleProps {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

/** A plain `<a>` styled as a button, for external, `tel:` and in-page hash links. */
export function ButtonAnchor({
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonAnchorProps) {
  return (
    <a className={buttonClasses({ variant, size, fullWidth }, className)} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </a>
  )
}
