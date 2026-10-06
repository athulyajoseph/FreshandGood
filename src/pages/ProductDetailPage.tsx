import { useParams } from 'react-router-dom'
import { PhasePlaceholder } from '@/components/common/PhasePlaceholder'

export default function ProductDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  return (
    <PhasePlaceholder
      title="Product details"
      description="Price, origin, description and related products."
      phase={2}
      breadcrumbs={[{ label: 'Products', to: '/products' }, { label: slug }]}
    >
      Requested product: <code className="rounded bg-stone-100 px-1.5 py-0.5">{slug}</code>
    </PhasePlaceholder>
  )
}
