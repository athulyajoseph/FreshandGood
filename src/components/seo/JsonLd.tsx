import { Helmet } from 'react-helmet-async'
import type { JsonLdObject } from './structuredData'

/** Adds a schema.org JSON-LD `<script>` to the document head. */
export function JsonLd({ data }: { data: JsonLdObject }) {
  // Escape "<" so content can never close the script tag early.
  const json = JSON.stringify(data).replace(/</g, '\u003c')
  return (
    <Helmet>
      <script type="application/ld+json">{json}</script>
    </Helmet>
  )
}
