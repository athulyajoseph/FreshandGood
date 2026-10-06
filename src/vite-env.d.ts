/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string
  /** Always set: vite.config.ts resolves it (with a placeholder fallback) at build time. */
  readonly VITE_SITE_URL: string
  readonly VITE_CONTACT_FORM_ENDPOINT?: string
  readonly VITE_CONTACT_FORM_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
