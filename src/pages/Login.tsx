import {
  Box, Typography, TextField, Button, Container,
  InputAdornment, IconButton, CircularProgress,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useLoginForm } from '../services/loginService'

const C = {
  bg: '#18181b', surface: '#27272a', surface2: '#3f3f46',
  border: 'rgba(255,255,255,0.1)', borderHover: 'rgba(255,255,255,0.22)',
  red: '#e8000d', redDark: '#c4000b',
  ink: '#f4f4f5', muted: '#a1a1aa',
  error: '#f87171', success: '#4ade80',
}

const FONT_DISPLAY = "'Barlow Condensed', sans-serif"
const FONT_BODY = "'Nunito', sans-serif"

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: FONT_BODY, color: C.ink, bgcolor: C.surface2, borderRadius: '8px',
    '& fieldset': { borderColor: C.border },
    '&:hover fieldset': { borderColor: C.borderHover },
    '&.Mui-focused fieldset': { borderColor: C.red, borderWidth: '2px' },
    '& input': { caretColor: C.red, color: C.ink },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 100px ${C.surface2} inset`,
      WebkitTextFillColor: C.ink,
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: FONT_BODY, color: C.muted,
    '&.Mui-focused': { color: C.red },
  },
  '& .MuiFormHelperText-root': { fontFamily: FONT_BODY, color: C.error, mt: 0.5 },
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {!open && <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
    </svg>
  )
}

export default function Login() {
  const {
    form, errors, showPw, setShowPw,
    success, loading, apiError, loggedInName,
    handleChange, handleSubmit,
  } = useLoginForm()

  if (success) {
    return (
      <Box sx={{ bgcolor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Box sx={{
            bgcolor: C.surface, border: '1px solid rgba(74,222,128,0.25)',
            borderRadius: '16px', p: { xs: 4, md: 6 }, textAlign: 'center',
          }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(74,222,128,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3,
            }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l8 8L26 8" stroke={C.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Box>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '2rem', textTransform: 'uppercase', color: C.ink, mb: 1 }}>
              Willkommen <Box component="span" sx={{ color: C.success }}>zurück!</Box>
            </Typography>
            <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, mb: 4 }}>
              {loggedInName ? `Hallo, ${loggedInName.split(' ')[0]}!` : 'Anmeldung erfolgreich.'}
            </Typography>
            <Button component={Link} to="/" sx={{
              bgcolor: C.red, color: '#fff', fontFamily: FONT_DISPLAY, fontWeight: 800,
              fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase',
              px: 4, py: 1.3, borderRadius: '8px', textDecoration: 'none',
              '&:hover': { bgcolor: C.redDark },
            }}>
              Zur Startseite
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xs">

        <Box sx={{ mb: 4 }}>
          <Typography component="h1" sx={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: { xs: '2.2rem', md: '3rem' }, textTransform: 'uppercase',
            letterSpacing: '-0.02em', lineHeight: 1, color: C.ink, mb: 1,
          }}>
            Anmelden
          </Typography>
          <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '0.95rem' }}>
            Noch kein Konto?{' '}
            <Box component={Link} to="/register" sx={{ color: C.red, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Jetzt registrieren
            </Box>
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{
          bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px',
          p: { xs: 3, md: 4 }, boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', gap: 2.5,
        }}>

          <TextField
            label="E-Mail"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            required
            fullWidth
            autoComplete="email"
            sx={fieldSx}
          />

          <TextField
            label="Passwort"
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange('password')}
            error={!!errors.password}
            helperText={errors.password}
            required
            fullWidth
            autoComplete="current-password"
            sx={fieldSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw((v) => !v)} edge="end" sx={{ color: C.muted, '&:hover': { color: C.ink } }}>
                      <EyeIcon open={showPw} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {apiError && (
            <Box sx={{ bgcolor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', px: 2, py: 1.5 }}>
              <Typography sx={{ fontFamily: FONT_BODY, color: C.error, fontSize: '0.9rem' }}>{apiError}</Typography>
            </Box>
          )}

          <Button type="submit" fullWidth disabled={loading} sx={{
            bgcolor: loading ? '#3f3f46' : C.red, color: '#fff',
            fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1rem',
            letterSpacing: '0.06em', textTransform: 'uppercase', py: 1.5, borderRadius: '8px',
            '&:hover': { bgcolor: loading ? '#3f3f46' : C.redDark },
            transition: 'background 0.15s',
          }}>
            {loading ? <CircularProgress size={22} sx={{ color: C.muted }} /> : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Anmelden
              </Box>
            )}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
