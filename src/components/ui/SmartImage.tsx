import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/utils'
import { Skeleton } from './Skeleton'

const FALLBACK_IMAGE = '/images/fallback.svg'

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string | undefined
  alt: string
  /**
   * Wrapper classes. Give the wrapper an aspect ratio (e.g. `aspect-[4/3]`) so the space is
   * reserved before the image loads and nothing shifts.
   */
  className?: string
  imgClassName?: string
  /** Shown when `src` is missing or fails to load. */
  fallbackSrc?: string
  /** Load eagerly with high fetch priority, for above-the-fold images. */
  priority?: boolean
}

/**
 * An image that fills a fixed-ratio box, lazy-loads by default, shows a skeleton until it
 * has loaded, and swaps to a fallback image if loading fails.
 */
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  fallbackSrc = FALLBACK_IMAGE,
  priority = false,
  ...props
}: SmartImageProps) {
  const [failedSrc, setFailedSrc] = useState<string>()
  const [settledSrc, setSettledSrc] = useState<string>()

  const currentSrc = !src || failedSrc === src ? fallbackSrc : src
  const settled = settledSrc === currentSrc

  return (
    <div className={cn('relative overflow-hidden bg-stone-100', className)}>
      {!settled && <Skeleton className="absolute inset-0 rounded-none" />}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setSettledSrc(currentSrc)}
        onError={() => {
          if (src && currentSrc !== fallbackSrc) setFailedSrc(src)
          // The fallback itself failed: stop the skeleton and let the alt text show.
          else setSettledSrc(currentSrc)
        }}
        className={cn(
          'absolute inset-0 size-full object-cover transition-opacity duration-300',
          settled ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
        {...props}
      />
    </div>
  )
}
