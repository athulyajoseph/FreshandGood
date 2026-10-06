import { useParams } from 'react-router-dom'
import { PhasePlaceholder } from '@/components/common/PhasePlaceholder'

export default function CategoryPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  return (
    <PhasePlaceholder
      title="Category"
      description="Products in this category, with filters and sorting."
      phase={2}
      breadcrumbs={[{ label: 'Categories', to: '/categories' }, { label: slug }]}
    >
      Requested category: <code className="rounded bg-stone-100 px-1.5 py-0.5">{slug}</code>
    </PhasePlaceholder>
  )
}
