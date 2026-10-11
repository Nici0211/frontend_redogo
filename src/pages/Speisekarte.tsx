import { Box, Typography, Button, Container, Grid, CircularProgress } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { formatPreis, useSpeisekarte } from '../services/speisekarteService'
import type { SpeisekarteEintrag } from '../services/speisekarteService'

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

function Abschnitt({ titel, eintraege, leerText }: { titel: string; eintraege: SpeisekarteEintrag[]; leerText: string }) {
  return (
    <Box component="section" sx={{ mb: 8 }}>
      <Typography
        component="h2"
        sx={{
          fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.2rem' },
          textTransform: 'uppercase', letterSpacing: '0.02em', color: C.ink, mb: 3,
        }}
      >
        <Box component="span" sx={{ color: C.red }}>{titel}</Box>
      </Typography>

      {eintraege.length === 0 ? (
        <Typography sx={{ fontFamily: FONT_BODY, color: C.muted }}>{leerText}</Typography>
      ) : (
        <Grid container spacing={3} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {eintraege.map((e) => (
            <Grid key={e.id} component="li" size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                component="article"
                sx={{
                  bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px',
                  p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  '&:hover': { borderColor: 'rgba(232,0,13,0.5)', boxShadow: '0 4px 24px rgba(232,0,13,0.08)' },
                }}
              >
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.3rem',
                    textTransform: 'uppercase', color: C.ink, letterSpacing: '0.02em', mb: 1,
                  }}
                >
                  {e.name}
                </Typography>
                {e.description && (
                  <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '0.92rem', lineHeight: 1.65, mb: 2, flex: 1 }}>
                    {e.description}
                  </Typography>
                )}
                <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.4rem', color: C.red, mt: 'auto' }}>
                  {formatPreis(e.price)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default function Speisekarte() {
  const { id } = useParams<{ id: string }>()
  const { speisekarte, loading, error, retry } = useSpeisekarte(id)

  return (
    <Box component="main" sx={{ bgcolor: C.bg, minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
        <Typography
          component={Link}
          to="/standorte"
          sx={{
            fontFamily: FONT_BODY, fontWeight: 700, fontSize: '0.9rem', color: C.muted,
            textDecoration: 'none', display: 'inline-block', mb: 3,
            '&:hover': { color: C.red },
          }}
        >
          ← Alle Standorte
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress aria-label="Speisekarte wird geladen" sx={{ color: C.red }} />
          </Box>
        )}

        {!loading && error && (
          <Box role="alert" sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontFamily: FONT_BODY, color: C.error, mb: 3 }}>{error.message}</Typography>
            {!error.notFound && (
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
            )}
          </Box>
        )}

        {!loading && !error && speisekarte && (
          <>
            <Typography
              component="h1"
              sx={{
                fontFamily: FONT_DISPLAY, fontWeight: 900,
                fontSize: { xs: '2.4rem', md: '3.4rem' }, textTransform: 'uppercase',
                letterSpacing: '-0.01em', lineHeight: 1, color: C.ink, mb: 1.5,
              }}
            >
              Speisekarte
            </Typography>
            <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '1.05rem', mb: 6 }}>
              {speisekarte.restaurantName}
            </Typography>

            <Abschnitt
              titel="Gerichte"
              eintraege={speisekarte.gerichte}
              leerText="Aktuell sind keine Gerichte verfügbar."
            />
            <Abschnitt
              titel="Menüs"
              eintraege={speisekarte.menues}
              leerText="Aktuell sind keine Menüs verfügbar."
            />
          </>
        )}
      </Container>
    </Box>
  )
}
