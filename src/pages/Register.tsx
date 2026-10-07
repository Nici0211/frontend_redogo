import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Link } from 'react-router-dom'

const C = {
  bg: '#0d0d0d',
  surface: '#141414',
  surface2: '#1a1a1a',
  border: 'rgba(255,255,255,0.08)',
  red: '#e8000d',
  redDark: '#c4000b',
  redGlow: 'rgba(232,0,13,0.18)',
  ink: '#f5f5f5',
  muted: 'rgba(245,245,245,0.55)',
  subtle: 'rgba(245,245,245,0.18)',
  error: '#f87171',
  success: '#4ade80',
}

const FONT_DISPLAY = "'Barlow Condensed', sans-serif"
const FONT_BODY = "'Nunito', sans-serif"

interface FormState {
  vorname: string
  nachname: string
  email: string
  passwort: string
  passwortWdh: string
}

interface FormErrors {
  vorname?: string
  nachname?: string
  email?: string
  passwort?: string
  passwortWdh?: string
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.vorname.trim()) errors.vorname = 'Pflichtfeld'
  if (!form.nachname.trim()) errors.nachname = 'Pflichtfeld'
  if (!form.email.trim()) {
    errors.email = 'Pflichtfeld'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ungültige E-Mail-Adresse'
  }
  if (!form.passwort) {
    errors.passwort = 'Pflichtfeld'
  } else if (form.passwort.length < 8) {
    errors.passwort = 'Mindestens 8 Zeichen'
  }
  if (!form.passwortWdh) {
    errors.passwortWdh = 'Pflichtfeld'
  } else if (form.passwort !== form.passwortWdh) {
    errors.passwortWdh = 'Passwörter stimmen nicht überein'
  }
  return errors
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: FONT_BODY,
    color: C.ink,
    bgcolor: C.surface2,
    borderRadius: '8px',
    '& fieldset': { borderColor: C.border },
    '&:hover fieldset': { borderColor: C.subtle },
    '&.Mui-focused fieldset': { borderColor: C.red },
  },
  '& .MuiInputLabel-root': {
    fontFamily: FONT_BODY,
    color: C.muted,
    '&.Mui-focused': { color: C.red },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: FONT_BODY,
    color: C.error,
  },
}

export default function Register() {
  const [form, setForm] = useState<FormState>({
    vorname: '',
    nachname: '',
    email: '',
    passwort: '',
    passwortWdh: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPw, setShowPw] = useState(false)
  const [showPwWdh, setShowPwWdh] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <Box sx={{ bgcolor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              bgcolor: C.surface,
              border: `1px solid rgba(74,222,128,0.25)`,
              borderRadius: '16px',
              p: { xs: 4, md: 6 },
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(74,222,128,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M6 16l8 8L26 8"
                  stroke={C.success}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 900,
                fontSize: '2rem',
                textTransform: 'uppercase',
                color: C.ink,
                mb: 1.5,
              }}
            >
              Registrierung{' '}
              <Box component="span" sx={{ color: C.success }}>
                erfolgreich!
              </Box>
            </Typography>
            <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, mb: 4 }}>
              Willkommen bei RedoGo, {form.vorname}!
            </Typography>
            <Button
              component={Link}
              to="/"
              sx={{
                bgcolor: C.red,
                color: '#fff',
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                px: 4,
                py: 1.3,
                borderRadius: '8px',
                textDecoration: 'none',
                '&:hover': { bgcolor: C.redDark },
              }}
            >
              Zur Startseite
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          top: '-20%',
          right: '-5%',
          width: '40%',
          height: '140%',
          background: `radial-gradient(ellipse at 80% 40%, rgba(232,0,13,0.06) 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative' }}>
        <Box sx={{ mb: 5 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              color: C.ink,
              mb: 1.5,
            }}
          >
            Konto{' '}
            <Box component="span" sx={{ color: C.red }}>
              erstellen
            </Box>
          </Typography>
          <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '0.95rem' }}>
            Bereits registriert?{' '}
            <Box
              component={Link}
              to="/login"
              sx={{ color: C.red, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Jetzt anmelden
            </Box>
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            bgcolor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            p: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
            <TextField
              label="Vorname"
              value={form.vorname}
              onChange={handleChange('vorname')}
              error={!!errors.vorname}
              helperText={errors.vorname}
              required
              sx={fieldSx}
            />
            <TextField
              label="Nachname"
              value={form.nachname}
              onChange={handleChange('nachname')}
              error={!!errors.nachname}
              helperText={errors.nachname}
              required
              sx={fieldSx}
            />
          </Box>

          <TextField
            label="E-Mail"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            required
            fullWidth
            sx={fieldSx}
          />

          <TextField
            label="Passwort"
            type={showPw ? 'text' : 'password'}
            value={form.passwort}
            onChange={handleChange('passwort')}
            error={!!errors.passwort}
            helperText={errors.passwort || 'Mindestens 8 Zeichen'}
            required
            fullWidth
            sx={fieldSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPw((v) => !v)}
                      edge="end"
                      sx={{ color: C.muted, '&:hover': { color: C.ink } }}
                    >
                      {showPw ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Passwort wiederholen"
            type={showPwWdh ? 'text' : 'password'}
            value={form.passwortWdh}
            onChange={handleChange('passwortWdh')}
            error={!!errors.passwortWdh}
            helperText={errors.passwortWdh}
            required
            fullWidth
            sx={fieldSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPwWdh((v) => !v)}
                      edge="end"
                      sx={{ color: C.muted, '&:hover': { color: C.ink } }}
                    >
                      {showPwWdh ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              bgcolor: C.red,
              color: '#fff',
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              py: 1.5,
              borderRadius: '8px',
              mt: 0.5,
              '&:hover': {
                bgcolor: C.redDark,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 28px ${C.redGlow}`,
              },
              transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            Registrieren
          </Button>
        </Box>
      </Container>
    </Box>
  )
}