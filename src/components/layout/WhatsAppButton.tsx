import { siteConfig, whatsappLink } from '@/config/site'

/** Floating "chat on WhatsApp" button, fixed to the bottom-right corner. */
export function WhatsAppButton() {
  const href = whatsappLink(`Hi ${siteConfig.name}! I have a question.`)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className="group fixed right-4 bottom-4 z-30 flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:outline-offset-4 sm:right-6 sm:bottom-6"
    >
      <svg viewBox="0 0 32 32" className="size-7 fill-current" aria-hidden="true">
        <path d="M16.004 3C8.82 3 3 8.82 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.71A12.94 12.94 0 0 0 16.004 29C23.18 29 29 23.18 29 16S23.18 3 16.004 3Zm0 23.64c-2.02 0-4-.54-5.73-1.57l-.41-.24-3.96 1.02 1.06-3.86-.27-.4A10.6 10.6 0 0 1 5.36 16c0-5.87 4.77-10.64 10.64-10.64S26.64 10.13 26.64 16 21.87 26.64 16 26.64Zm5.83-7.97c-.32-.16-1.89-.93-2.18-1.04-.29-.1-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.14 3.08 1.3 3.3c.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.46.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100 sm:block">
        Chat with us
      </span>
    </a>
  )
}
