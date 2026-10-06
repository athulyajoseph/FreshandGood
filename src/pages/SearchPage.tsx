import { PhasePlaceholder } from '@/components/common/PhasePlaceholder'
import { useQueryParams } from '@/hooks'

export default function SearchPage() {
  const { get } = useQueryParams()
  const query = get('q')

  return (
    <PhasePlaceholder
      title="Search"
      description="Search across every product by name, Malayalam name or tag."
      phase={4}
      breadcrumbs={[{ label: 'Search' }]}
    >
      {query && (
        <>
          Your search: <code className="rounded bg-stone-100 px-1.5 py-0.5">{query}</code>
        </>
      )}
    </PhasePlaceholder>
  )
}
