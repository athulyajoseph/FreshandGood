import { PhasePlaceholder } from '@/components/common/PhasePlaceholder'

export default function CategoriesPage() {
  return (
    <PhasePlaceholder
      title="Categories"
      description="Browse fruits and vegetables, spices, snacks, seafood and breakfast staples."
      phase={2}
      breadcrumbs={[{ label: 'Categories' }]}
    />
  )
}
