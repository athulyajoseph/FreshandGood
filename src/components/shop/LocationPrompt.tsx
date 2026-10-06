import { CircleCheck, LoaderCircle, LocateFixed, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui'
import { useUserLocation } from '@/hooks'
import { cn } from '@/utils'

interface LocationPromptProps {
  /**
   * `panel`: a bordered box (default). `compact`: no box, for embedding in a section.
   * `inverse`: light text for dark backgrounds.
   */
  variant?: 'panel' | 'compact' | 'inverse'
  /** Text above the button while location hasn't been shared. */
  intro?: string
  className?: string
}

const LOCATION_PRIVACY_NOTE = 'Your location is only used in your browser to find nearby shops.'

/**
 * "Use my location" button with live status and a privacy note. Location is only requested
 * when the button is clicked, and the result is shared app-wide through `LocationProvider`.
 */
export function LocationPrompt({
  variant = 'panel',
  intro = 'Share your location to see the nearest shops first.',
  className,
}: LocationPromptProps) {
  const { status, error, requestLocation, clearLocation } = useUserLocation()
  const inverse = variant === 'inverse'
  const loading = status === 'loading'
  const granted = status === 'granted'
  const failed = Boolean(error) && !loading && !granted

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        variant === 'panel' && 'rounded-2xl border border-stone-200 bg-white p-4 sm:p-5',
        className,
      )}
    >
      {/* Announce status changes (locating, granted, failures) to screen readers. */}
      <div aria-live="polite" className="flex flex-col gap-3">
        {granted ? (
          <p
            className={cn(
              'flex items-start gap-2 text-sm font-medium',
              inverse ? 'text-white' : 'text-brand-800',
            )}
          >
            <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Showing shops nearest to you.
          </p>
        ) : failed ? (
          <p
            className={cn(
              'flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm',
              inverse ? 'bg-white/10 text-white' : 'bg-accent-50 text-accent-700',
            )}
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : loading || intro ? (
          <p className={cn('text-sm', inverse ? 'text-brand-100' : 'text-stone-600')}>
            {loading ? 'Finding your location…' : intro}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {granted ? (
          <>
            <Button
              variant={inverse ? 'secondary' : 'outline'}
              size="sm"
              onClick={requestLocation}
              leftIcon={<LocateFixed className="size-4" aria-hidden="true" />}
            >
              Update my location
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLocation}
              className={cn(inverse && 'text-white hover:bg-white/10 active:bg-white/20')}
            >
              Clear location
            </Button>
          </>
        ) : (
          <Button
            variant={inverse ? 'secondary' : 'primary'}
            size={variant === 'compact' ? 'sm' : 'md'}
            onClick={requestLocation}
            disabled={loading}
            aria-busy={loading || undefined}
            leftIcon={
              loading ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <LocateFixed className="size-4" aria-hidden="true" />
              )
            }
          >
            {loading ? 'Locating…' : failed ? 'Try again' : 'Use my location'}
          </Button>
        )}
      </div>

      <p
        className={cn(
          'flex items-start gap-1.5 text-xs',
          inverse ? 'text-brand-100' : 'text-stone-500',
        )}
      >
        <ShieldCheck className="mt-px size-3.5 shrink-0" aria-hidden="true" />
        {LOCATION_PRIVACY_NOTE}
      </p>
    </div>
  )
}
