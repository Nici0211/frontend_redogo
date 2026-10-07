import { useState } from 'react'

export interface RegisterFormState {
  vorname: string
  nachname: string
  email: string
  telefon: string
  strasse: string
  hausnummer: string
  plz: string
  ort: string
  passwort: string
  passwortWdh: string
}

export interface RegisterFormErrors {
  vorname?: string
  nachname?: string
  email?: string
  strasse?: string
  hausnummer?: string
  plz?: string
  ort?: string
  passwort?: string
  passwortWdh?: string
}

export const EMPTY_FORM: RegisterFormState = {
  vorname: '', nachname: '', email: '', telefon: '',
  strasse: '', hausnummer: '', plz: '', ort: '',
  passwort: '', passwortWdh: '',
}

export function validateRegisterForm(form: RegisterFormState): RegisterFormErrors {
  const errors: RegisterFormErrors = {}
  if (!form.vorname.trim()) errors.vorname = 'Pflichtfeld'
  if (!form.nachname.trim()) errors.nachname = 'Pflichtfeld'
  if (!form.email.trim()) { errors.email = 'Pflichtfeld' }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Ungültige E-Mail-Adresse' }
  if (!form.strasse.trim()) errors.strasse = 'Pflichtfeld'
  if (!form.hausnummer.trim()) errors.hausnummer = 'Pflichtfeld'
  if (!form.plz.trim()) { errors.plz = 'Pflichtfeld' }
  else if (!/^\d{4,5}$/.test(form.plz.trim())) { errors.plz = 'Ungültige PLZ' }
  if (!form.ort.trim()) errors.ort = 'Pflichtfeld'
  if (!form.passwort) { errors.passwort = 'Pflichtfeld' }
  else if (form.passwort.length < 8) { errors.passwort = 'Mindestens 8 Zeichen' }
  if (!form.passwortWdh) { errors.passwortWdh = 'Pflichtfeld' }
  else if (form.passwort !== form.passwortWdh) { errors.passwortWdh = 'Passwörter stimmen nicht überein' }
  return errors
}

export function useRegisterForm() {
  const [form, setForm] = useState<RegisterFormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [showPw, setShowPw] = useState(false)
  const [showPwWdh, setShowPwWdh] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  function handleChange(field: keyof RegisterFormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateRegisterForm(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setApiError(null)

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vorname: form.vorname,
          nachname: form.nachname,
          email: form.email,
          telefon: form.telefon || null,
          strasse: form.strasse,
          hausnummer: form.hausnummer,
          plz: form.plz,
          ort: form.ort,
          passwort: form.passwort,
        }),
      })

      if (res.status === 201) {
        setSuccess(true)
      } else if (res.status === 409) {
        setErrors((prev) => ({ ...prev, email: 'E-Mail bereits registriert' }))
      } else {
        setApiError('Fehler beim Registrieren. Bitte versuche es erneut.')
      }
    } catch {
      setApiError('Server nicht erreichbar. Bitte versuche es später.')
    } finally {
      setLoading(false)
    }
  }

  return {
    form, errors, showPw, setShowPw, showPwWdh, setShowPwWdh,
    success, loading, apiError, handleChange, handleSubmit,
  }
}
