import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setUserId, setUserName } from './userSession'

export interface LoginFormState {
  email: string
  password: string
}

export interface LoginFormErrors {
  email?: string
  password?: string
}

export const EMPTY_LOGIN_FORM: LoginFormState = { email: '', password: '' }

export function validateLoginForm(form: LoginFormState): LoginFormErrors {
  const errors: LoginFormErrors = {}
  if (!form.email.trim()) { errors.email = 'Pflichtfeld' }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Ungültige E-Mail-Adresse' }
  if (!form.password) { errors.password = 'Pflichtfeld' }
  return errors
}

export function useLoginForm() {
  const [form, setForm] = useState<LoginFormState>(EMPTY_LOGIN_FORM)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const navigate = useNavigate()

  function handleChange(field: keyof LoginFormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateLoginForm(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setApiError(null)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, passwort: form.password }),
      })

      if (res.status === 200) {
        const user = await res.json()
        if (typeof user?.id === 'number') setUserId(user.id)
        const name = `${user?.vorname ?? ''} ${user?.nachname ?? ''}`.trim()
        if (name) setUserName(name)
        navigate('/')
      } else if (res.status === 401) {
        setApiError('E-Mail oder Passwort ungültig')
      } else {
        setApiError('Fehler beim Anmelden. Bitte versuche es erneut.')
      }
    } catch {
      setApiError('Server nicht erreichbar. Bitte versuche es später.')
    } finally {
      setLoading(false)
    }
  }

  return {
    form, errors, showPw, setShowPw,
    loading, apiError,
    handleChange, handleSubmit,
  }
}
