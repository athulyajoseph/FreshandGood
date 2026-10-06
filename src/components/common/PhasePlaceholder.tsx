import { Hammer } from 'lucide-react'
import type { ReactNode } from 'react'
import { PageMeta } from '@/components/seo/PageMeta'
import {
  Breadcrumbs,
  ButtonLink,
  Container,
  EmptyState,
  type BreadcrumbItem,
} from '@/components/ui'

interface PhasePlaceholderProps {
  title: string
  description: string
  phase: 2 | 3 | 4
  breadcrumbs?: BreadcrumbItem[]
  /** Extra context, e.g. the current route parameter. */
  children?: ReactNode
}

/** Temporary page body for routes that are built in a later phase. */
export function PhasePlaceholder({
  title,
  description,
  phase,
  breadcrumbs,
  children,
}: PhasePlaceholderProps) {
  return (
    <>
      <PageMeta title={title} description={description} />
      <Container className="py-8 sm:py-12">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-stone-600">{description}</p>

        <EmptyState
          className="mt-10"
          icon={<Hammer />}
          title={`Coming in Phase ${phase}`}
          description={
            <>
              This page is part of Phase {phase} of the build and isn&apos;t ready yet.
              {children && <div className="mt-3">{children}</div>}
            </>
          }
          action={
            <ButtonLink to="/" variant="outline">
              Back to home
            </ButtonLink>
          }
        />
      </Container>
    </>
  )
}
