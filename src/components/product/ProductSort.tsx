import { Select } from '@/components/ui'
import { PRODUCT_SORT_OPTIONS } from '@/hooks'
import type { ProductSortOption } from '@/types'

interface ProductSortProps {
  value: ProductSortOption
  onChange: (value: ProductSortOption) => void
  className?: string
}

export function ProductSort({ value, onChange, className }: ProductSortProps) {
  return (
    <Select
      label="Sort by"
      options={PRODUCT_SORT_OPTIONS}
      value={value}
      onChange={(event) => onChange(event.target.value as ProductSortOption)}
      containerClassName={className}
    />
  )
}
