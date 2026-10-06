import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck, LoaderCircle, RotateCw, Send, TriangleAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button, Input, Select, Textarea } from '@/components/ui'
import { contactFormConfig, siteConfig } from '@/config/site'
import { cn, pluralize } from '@/utils'
import {
  CONTACT_DEFAULTS,
  CONTACT_SUBJECTS,
  contactSchema,
  MESSAGE_MIN_LENGTH,
  type ContactFormValues,
} from './contactSchema'

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

const SUBJECT_OPTIONS = CONTACT_SUBJECTS.map(({ value, label }) => ({ value, label }))

/** Posts the message to Web3Forms (https://web3forms.com). Throws with a friendly message. */
async function sendMessage(values: ContactFormValues): Promise<void> {
  const topic = CONTACT_SUBJECTS.find((s) => s.value === values.subject)?.label ?? 'Enquiry'
  let response: Response
  try {
    response = await fetch(contactFormConfig.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: contactFormConfig.accessKey,
        subject: `[${siteConfig.name} website] ${topic} from ${values.name}`,
        from_name: `${siteConfig.name} website`,
        replyto: values.email,
        name: values.name,
        email: values.email,
        phone: values.phone || 'Not given',
        topic,
        message: values.message,
        botcheck: values.botcheck,
      }),
    })
  } catch {
    throw new Error('We couldn’t reach the server. Please check your internet connection.')
  }

  const result = (await response.json().catch(() => null)) as { success?: boolean } | null
  if (!response.ok || !result?.success) {
    throw new Error('The message service had a problem on its side.')
  }
}

/**
 * Contact form with validation, spam honeypot and Web3Forms delivery. Typed text is kept if
 * sending fails, so nothing is lost on retry.
 */
export function ContactForm() {
  const [status, setStatus] = useState<SendStatus>('idle')
  const [sendError, setSendError] = useState('')
  const successRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, submitCount, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: CONTACT_DEFAULTS,
    mode: 'onTouched',
  })

  const onSubmit = handleSubmit(async (values) => {
    setStatus('sending')
    setSendError('')
    try {
      // Bots fill the hidden honeypot; pretend it worked without sending anything.
      if (!values.botcheck) await sendMessage(values)
      reset(CONTACT_DEFAULTS)
      setStatus('success')
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Something went wrong.')
      setStatus('error')
    }
  })

  // Move focus to the confirmation so keyboard and screen-reader users hear it.
  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const errorCount = Object.keys(errors).length
  const messageLength = useWatch({ control, name: 'message' }).trim().length
  const sending = status === 'sending'

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-describedby="contact-form-note"
      className="flex flex-col gap-5"
    >
      {status === 'success' && (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="flex gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900 focus:outline-none"
        >
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-brand-700" aria-hidden="true" />
          <div>
            <p className="font-semibold">Thank you — your message is on its way!</p>
            <p className="mt-1">
              We usually reply within one working day. For anything urgent, call us on{' '}
              {siteConfig.contact.phone}.
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-start"
        >
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold">Sorry, your message wasn’t sent.</p>
            <p className="mt-1">
              {sendError} Your message is still below, so you can try again, or email us at{' '}
              <a href={`mailto:${siteConfig.contact.email}`} className="font-medium underline">
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void onSubmit()}
            leftIcon={<RotateCw className="size-4" aria-hidden="true" />}
            className="self-start border-red-300 text-red-800 hover:bg-red-100"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Summarise validation problems after a submit attempt. */}
      <p className="sr-only" aria-live="assertive">
        {submitCount > 0 && !isValid && errorCount > 0
          ? `Please fix ${pluralize(errorCount, 'field')} before sending.`
          : ''}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Your name"
          autoComplete="name"
          required
          aria-required="true"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          aria-required="true"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="98765 43210"
          error={errors.phone?.message}
          hint="So we can call you back, if you prefer."
          {...register('phone')}
        />
        <Select
          label="Subject"
          options={SUBJECT_OPTIONS}
          containerClassName="flex-col items-stretch gap-1.5"
          className="h-11"
          {...register('subject')}
        />
      </div>

      <Textarea
        label="Message"
        rows={6}
        required
        aria-required="true"
        placeholder="How can we help?"
        error={errors.message?.message}
        hint={`At least ${MESSAGE_MIN_LENGTH} characters${messageLength ? ` · ${messageLength} so far` : ''}.`}
        {...register('message')}
      />

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill every field. */}
      <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-botcheck">Leave this field empty</label>
        <input
          id="contact-botcheck"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('botcheck')}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-form-note" className="text-xs text-stone-500">
          We only use your details to reply to you.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={sending}
          aria-busy={sending || undefined}
          leftIcon={
            sending ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="size-5" aria-hidden="true" />
            )
          }
          className={cn(sending && 'cursor-wait')}
        >
          {sending ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}
