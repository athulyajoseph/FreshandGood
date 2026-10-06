import { PhasePlaceholder } from '@/components/common/PhasePlaceholder'

export default function AboutPage() {
  return (
    <PhasePlaceholder
      title="About Us"
      description="The story behind Fresh & Good and the Kerala farmers and shops we work with."
      phase={4}
      breadcrumbs={[{ label: 'About' }]}
    />
  )
}
