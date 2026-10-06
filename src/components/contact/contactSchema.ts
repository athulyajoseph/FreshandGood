import { z } from 'zod'

export const CONTACT_SUBJECTS = [
  { value: 'general', label: 'General enquiry' },
  { value: 'product', label: 'Product enquiry' },
  { value: 'stockist', label: 'Become a stockist' },
  { value: 'feedback', label: 'Feedback' },
] as const

type SubjectValue = (typeof CONTACT_SUBJECTS)[number]['value']
const SUBJECT_VALUES = CONTACT_SUBJECTS.map((s) => s.value) as [SubjectValue, ...SubjectValue[]]

export const MESSAGE_MIN_LENGTH = 10

/**
 * A 10-digit Indian number (mobile, or landline with STD code), optionally prefixed with +91,
 * 91 or 0. Spaces, dashes and brackets are ignored.
 */
function isIndianPhone(value: string): boolean {
  const digits = value.replace(/[\s()-]/g, '')
  return /^(?:\+?91|0)?[1-9]\d{9}$/.test(digits)
}

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please tell us your name.').max(100, 'That name is too long.'),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email so we can reply.')
    .pipe(z.email('Please enter a valid email address, like name@example.com.')),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || isIndianPhone(value),
      'Please enter a 10-digit Indian phone number, e.g. 98765 43210.',
    ),
  subject: z.enum(SUBJECT_VALUES, 'Please choose a subject.'),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN_LENGTH, `Please write at least ${MESSAGE_MIN_LENGTH} characters.`)
    .max(5000, 'Please keep your message under 5,000 characters.'),
  /** Honeypot: real visitors never see or fill this field. */
  botcheck: z.string(),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export const CONTACT_DEFAULTS: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  subject: 'general',
  message: '',
  botcheck: '',
}
