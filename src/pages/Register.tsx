import {
  Box, Typography, TextField, Button, Container,
  Grid, InputAdornment, IconButton, Divider, CircularProgress,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useRegisterForm } from '../services/registerService'

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

const sectionLabel = {
  fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '0.78rem',
  textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: C.muted, mb: 2,
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

export default function Register() {
  const {
    form, errors, showPw, setShowPw, showPwWdh, setShowPwWdh,
    success, loading, apiError, handleChange, handleSubmit,
  } = useRegisterForm()

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
              Registrierung <Box component="span" sx={{ color: C.success }}>erfolgreich!</Box>
            </Typography>
            <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, mb: 4 }}>
              Willkommen bei RedoGo, {form.vorname}!
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
    <Box sx={{ bgcolor: C.bg, minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">

        <Box sx={{ mb: 4 }}>
          <Typography component="h1" sx={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: { xs: '2.2rem', md: '3rem' }, textTransform: 'uppercase',
            letterSpacing: '-0.02em', lineHeight: 1, color: C.ink, mb: 1,
          }}>
            Konto <Box component="span" sx={{ color: C.red }}>erstellen</Box>
          </Typography>
          <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '0.95rem' }}>
            Bereits registriert?{' '}
            <Box component={Link} to="/login" sx={{ color: C.red, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Jetzt anmelden
            </Box>
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{
          bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px',
          p: { xs: 3, md: 4 }, boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', gap: 3,
        }}>

          {/* Persönliche Daten */}
          <Box>
            <Typography sx={sectionLabel}>Persönliche Daten</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Vorname" value={form.vorname} onChange={handleChange('vorname')}
                  error={!!errors.vorname} helperText={errors.vorname} required fullWidth sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Nachname" value={form.nachname} onChange={handleChange('nachname')}
                  error={!!errors.nachname} helperText={errors.nachname} required fullWidth sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="E-Mail" type="email" value={form.email} onChange={handleChange('email')}
                  error={!!errors.email} helperText={errors.email} required fullWidth sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Telefon (optional)" type="tel" value={form.telefon}
                  onChange={handleChange('telefon')} fullWidth sx={fieldSx} />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: C.border }} />

          {/* Adresse */}
          <Box>
            <Typography sx={sectionLabel}>Adresse</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 8 }}>
                <TextField label="Straße" value={form.strasse} onChange={handleChange('strasse')}
                  error={!!errors.strasse} helperText={errors.strasse} required fullWidth sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField label="Nr." value={form.hausnummer} onChange={handleChange('hausnummer')}
                  error={!!errors.hausnummer} helperText={errors.hausnummer} required fullWidth sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField label="PLZ" value={form.plz} onChange={handleChange('plz')}
                  error={!!errors.plz} helperText={errors.plz} required fullWidth sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 8 }}>
                <TextField label="Ort" value={form.ort} onChange={handleChange('ort')}
                  error={!!errors.ort} helperText={errors.ort} required fullWidth sx={fieldSx} />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: C.border }} />

          {/* Passwort */}
          <Box>
            <Typography sx={sectionLabel}>Passwort</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField label="Passwort" type={showPw ? 'text' : 'password'}
                  value={form.passwort} onChange={handleChange('passwort')}
                  error={!!errors.passwort} helperText={errors.passwort} required fullWidth sx={fieldSx}
                  slotProps={{ input: { endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw(v => !v)} edge="end" sx={{ color: C.muted, '&:hover': { color: C.ink } }}>
                        <EyeIcon open={showPw} />
                      </IconButton>
                    </InputAdornment>
                  )}}} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Passwort wiederholen" type={showPwWdh ? 'text' : 'password'}
                  value={form.passwortWdh} onChange={handleChange('passwortWdh')}
                  error={!!errors.passwortWdh} helperText={errors.passwortWdh} required fullWidth sx={fieldSx}
                  slotProps={{ input: { endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPwWdh(v => !v)} edge="end" sx={{ color: C.muted, '&:hover': { color: C.ink } }}>
                        <EyeIcon open={showPwWdh} />
                      </IconButton>
                    </InputAdornment>
                  )}}} />
              </Grid>
            </Grid>
          </Box>

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
            {loading ? <CircularProgress size={22} sx={{ color: C.muted }} /> : 'Registrieren'}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
