import { PhasePlaceholder } from '@/components/common/PhasePlaceholder'

export default function ContactPage() {
  return (
    <PhasePlaceholder
      title="Contact Us"
      description="Questions, feedback or want to partner with us? Get in touch."
      phase={4}
      breadcrumbs={[{ label: 'Contact' }]}
    />
  )
}
