import { PhasePlaceholder } from '@/components/common/PhasePlaceholder'

export default function ProductsPage() {
  return (
    <PhasePlaceholder
      title="All Products"
      description="Every product we stock, with veg/non-veg, price and category filters."
      phase={2}
      breadcrumbs={[{ label: 'Products' }]}
    />
  )
}
