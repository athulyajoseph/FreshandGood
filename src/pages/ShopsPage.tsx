import { PhasePlaceholder } from '@/components/common/PhasePlaceholder'

export default function ShopsPage() {
  return (
    <PhasePlaceholder
      title="Find a Shop"
      description="Locate the nearest Fresh & Good partner shop on a map, sorted by distance from you."
      phase={3}
      breadcrumbs={[{ label: 'Find a Shop' }]}
    />
  )
}
