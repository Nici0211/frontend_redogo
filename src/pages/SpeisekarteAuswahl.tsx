import { useState } from 'react'
import { Box, Typography, Button, Container, CircularProgress, TextField, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useRestaurants } from '../services/restaurantService'

const C = {
  bg: '#18181b',
  surface: '#27272a',
  surface2: '#3f3f46',
  border: 'rgba(255,255,255,0.1)',
  borderHover: 'rgba(255,255,255,0.22)',
  red: '#e8000d',
  redDark: '#c4000b',
  ink: '#f4f4f5',
  muted: '#a1a1aa',
  error: '#f87171',
}

const FONT_DISPLAY = "'Barlow Condensed', sans-serif"
const FONT_BODY = "'Nunito', sans-serif"

export default function SpeisekarteAuswahl() {
  const { restaurants, loading, error, retry } = useRestaurants()
  const navigate = useNavigate()
  const [restaurantId, setRestaurantId] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (restaurantId) navigate(`/standorte/${restaurantId}/speisekarte`)
  }

  return (
    <Box component="main" sx={{ bgcolor: C.bg, minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm" sx={{ px: { xs: 3, md: 4 } }}>
        <Typography
          component="h1"
          sx={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: { xs: '2.4rem', md: '3.4rem' }, textTransform: 'uppercase',
            letterSpacing: '-0.01em', lineHeight: 1, color: C.ink, mb: 1.5,
          }}
        >
          <Box component="span" sx={{ color: C.red }}>Speisekarte</Box>
        </Typography>
        <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '1.05rem', mb: 5 }}>
          Wähle zuerst deinen Standort, dann zeigen wir dir die passende Speisekarte.
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress aria-label="Standorte werden geladen" sx={{ color: C.red }} />
          </Box>
        )}

        {!loading && error && (
          <Box role="alert" sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ fontFamily: FONT_BODY, color: C.error, mb: 3 }}>{error}</Typography>
            <Button
              onClick={retry}
              sx={{
                bgcolor: C.red, color: '#fff', fontFamily: FONT_DISPLAY, fontWeight: 800,
                letterSpacing: '0.05em', textTransform: 'uppercase', px: 4, py: 1.2, borderRadius: '8px',
                '&:hover': { bgcolor: C.redDark },
              }}
            >
              Erneut versuchen
            </Button>
          </Box>
        )}

        {!loading && !error && restaurants.length === 0 && (
          <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, textAlign: 'center', py: 6 }}>
            Aktuell sind keine Standorte verfügbar.
          </Typography>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px',
              p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3,
            }}
          >
            <TextField
              select
              label="Standort"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: FONT_BODY, color: C.ink, bgcolor: C.surface2, borderRadius: '8px',
                  '& fieldset': { borderColor: C.border },
                  '&:hover fieldset': { borderColor: C.borderHover },
                  '&.Mui-focused fieldset': { borderColor: C.red, borderWidth: '2px' },
                  '& .MuiSelect-icon': { color: C.muted },
                },
                '& .MuiInputLabel-root': { fontFamily: FONT_BODY, color: C.muted, '&.Mui-focused': { color: C.red } },
              }}
            >
              {restaurants.map((r) => (
                <MenuItem key={r.id} value={String(r.id)} sx={{ fontFamily: FONT_BODY }}>
                  {r.name}{r.location ? ` – ${r.location.postalCode}` : ''}
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              fullWidth
              disabled={!restaurantId}
              sx={{
                bgcolor: C.red, color: '#fff', fontFamily: FONT_DISPLAY, fontWeight: 800,
                fontSize: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                py: 1.5, borderRadius: '8px',
                '&:hover': { bgcolor: C.redDark },
                '&.Mui-disabled': { bgcolor: C.surface2, color: C.muted },
              }}
            >
              Speisekarte anzeigen
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}
