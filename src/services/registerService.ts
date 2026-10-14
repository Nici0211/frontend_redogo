import { useState } from 'react'
import { setUserId } from './userSession'

export interface RegisterFormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  streetNumber: string
  postalCode: string
  city: string
  password: string
  passwordRepeat: string
}

export interface RegisterFormErrors {
  firstName?: string
  lastName?: string
  email?: string
  street?: string
  streetNumber?: string
  postalCode?: string
  city?: string
  password?: string
  passwordRepeat?: string
}

export const EMPTY_FORM: RegisterFormState = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', streetNumber: '', postalCode: '', city: '',
  password: '', passwordRepeat: '',
}

export function validateRegisterForm(form: RegisterFormState): RegisterFormErrors {
  const errors: RegisterFormErrors = {}
  if (!form.firstName.trim()) errors.firstName = 'Pflichtfeld'
  if (!form.lastName.trim()) errors.lastName = 'Pflichtfeld'
  if (!form.email.trim()) { errors.email = 'Pflichtfeld' }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Ungültige E-Mail-Adresse' }
  if (!form.street.trim()) errors.street = 'Pflichtfeld'
  if (!form.streetNumber.trim()) errors.streetNumber = 'Pflichtfeld'
  if (!form.postalCode.trim()) { errors.postalCode = 'Pflichtfeld' }
  else if (!/^\d{4,5}$/.test(form.postalCode.trim())) { errors.postalCode = 'Ungültige PLZ' }
  if (!form.city.trim()) errors.city = 'Pflichtfeld'
  if (!form.password) { errors.password = 'Pflichtfeld' }
  else if (form.password.length < 8) { errors.password = 'Mindestens 8 Zeichen' }
  if (!form.passwordRepeat) { errors.passwordRepeat = 'Pflichtfeld' }
  else if (form.password !== form.passwordRepeat) { errors.passwordRepeat = 'Passwörter stimmen nicht überein' }
  return errors
}

export function useRegisterForm() {
  const [form, setForm] = useState<RegisterFormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [showPw, setShowPw] = useState(false)
  const [showPwRepeat, setShowPwRepeat] = useState(false)
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
          vorname: form.firstName,
          nachname: form.lastName,
          email: form.email,
          telefon: form.phone || null,
          strasse: form.street,
          hausnummer: form.streetNumber,
          plz: form.postalCode,
          ort: form.city,
          passwort: form.password,
        }),
      })

      if (res.status === 201) {
        try {
          // ID des neuen Benutzers merken - sie wird für den Warenkorb gebraucht
          const user = await res.json()
          if (typeof user?.id === 'number') setUserId(user.id)
        } catch {
          // Antwort ohne lesbaren Body - die Registrierung war trotzdem erfolgreich
        }
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
    form, errors, showPw, setShowPw, showPwRepeat, setShowPwRepeat,
    success, loading, apiError, handleChange, handleSubmit,
  }
}
