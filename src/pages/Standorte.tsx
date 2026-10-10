import { Box, Typography, Button, Container, Grid, CircularProgress } from '@mui/material'
import { useRestaurants } from '../services/restaurantService'

const C = {
  bg: '#18181b',
  surface: '#27272a',
  border: 'rgba(255,255,255,0.08)',
  red: '#e8000d',
  redDark: '#c4000b',
  ink: '#f4f4f5',
  muted: '#a1a1aa',
  error: '#f87171',
}

const FONT_DISPLAY = "'Barlow Condensed', sans-serif"
const FONT_BODY = "'Nunito', sans-serif"

export default function Standorte() {
  const { restaurants, loading, error, retry } = useRestaurants()

  return (
    <Box component="main" sx={{ bgcolor: C.bg, minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
        <Typography
          component="h1"
          sx={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: { xs: '2.4rem', md: '3.4rem' }, textTransform: 'uppercase',
            letterSpacing: '-0.01em', lineHeight: 1, color: C.ink, mb: 1.5,
          }}
        >
          Unsere <Box component="span" sx={{ color: C.red }}>Standorte</Box>
        </Typography>
        <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '1.05rem', mb: 6, maxWidth: '55ch' }}>
          Alle RedoGo-Restaurants auf einen Blick — such dir den Standort in deiner Nähe aus.
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress aria-label="Standorte werden geladen" sx={{ color: C.red }} />
          </Box>
        )}

        {!loading && error && (
          <Box role="alert" sx={{ textAlign: 'center', py: 8 }}>
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
          <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, textAlign: 'center', py: 8 }}>
            Aktuell sind keine Standorte verfügbar.
          </Typography>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <Grid container spacing={3} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {restaurants.map((r) => (
              <Grid key={r.id} component="li" size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  component="article"
                  sx={{
                    bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px',
                    p: { xs: 3, md: 4 }, height: '100%',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    '&:hover': { borderColor: 'rgba(232,0,13,0.5)', boxShadow: '0 4px 24px rgba(232,0,13,0.08)' },
                  }}
                >
                  <Typography
                    component="h2"
                    sx={{
                      fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.4rem',
                      textTransform: 'uppercase', color: C.ink, letterSpacing: '0.02em', mb: 1.5,
                    }}
                  >
                    {r.name}
                  </Typography>
                  {r.location ? (
                    <>
                      <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, color: C.ink, fontSize: '0.95rem' }}>
                        {r.location.streetName}
                      </Typography>
                      <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '0.95rem', mb: 1.5 }}>
                        {r.location.postalCode}
                      </Typography>
                      {r.location.description && (
                        <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '0.9rem', lineHeight: 1.65 }}>
                          {r.location.description}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '0.95rem' }}>
                      Adresse folgt in Kürze.
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
