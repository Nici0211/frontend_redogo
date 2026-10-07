import { Box, Typography, Button, Container, Grid } from '@mui/material'
import { Link } from 'react-router-dom'

const C = {
  bg: '#18181b',
  surface: '#27272a',
  border: 'rgba(255,255,255,0.08)',
  red: '#e8000d',
  redDark: '#c4000b',
  ink: '#f4f4f5',
  muted: '#a1a1aa',
}

const FONT_DISPLAY = "'Barlow Condensed', sans-serif"
const FONT_BODY = "'Nunito', sans-serif"

const features = [
  { icon: '🛵', title: 'Lieferservice', desc: 'Frisches Essen direkt an deine Tür — ab 2,90 € Liefergebühr.' },
  { icon: '🏪', title: 'Abholung', desc: 'Online bestellen, abholen wenn es fertig ist. Ohne Wartezeit.' },
  { icon: '📅', title: 'Reservierung', desc: 'Tisch im Voraus buchen und mit Bestellung direkt loslegen.' },
]

export default function Home() {
  return (
    <Box sx={{ bgcolor: C.bg, minHeight: '100vh', fontFamily: FONT_BODY }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <Box component="section" sx={{ position: 'relative', overflow: 'hidden', py: { xs: 10, md: 18 }, display: 'flex', alignItems: 'center' }}>
        <Box aria-hidden sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=75)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <Box aria-hidden sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(24,24,27,0.92) 0%, rgba(24,24,27,0.65) 60%, rgba(24,24,27,0.35) 100%)',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', px: { xs: 3, md: 4 } }}>
          <Box sx={{ maxWidth: 600 }}>
            <Typography component="h1" sx={{
              fontFamily: FONT_DISPLAY, fontWeight: 900,
              fontSize: { xs: '2.8rem', md: '4.4rem' }, textTransform: 'uppercase',
              letterSpacing: '-0.02em', lineHeight: 0.95, color: C.ink, mb: 3,
            }}>
              Lokale Restaurants.{' '}
              <Box component="span" sx={{ color: C.red }}>Direkt zu dir.</Box>
            </Typography>

            <Typography sx={{ fontFamily: FONT_BODY, fontSize: '1.1rem', color: C.muted, lineHeight: 1.7, maxWidth: '48ch', mb: 5 }}>
              Bestelle bei den besten Restaurants in deiner Nähe — zur Lieferung,
              Abholung oder mit Tischreservierung. Einfach, schnell, lokal.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button sx={{
                bgcolor: C.red, color: '#fff', fontFamily: FONT_DISPLAY, fontWeight: 800,
                fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase',
                px: 4, py: 1.4, borderRadius: '8px',
                '&:hover': { bgcolor: C.redDark }, transition: 'background 0.15s',
              }}>
                Jetzt bestellen
              </Button>
              <Button component={Link} to="/registrieren" variant="outlined" sx={{
                color: C.ink, borderColor: 'rgba(255,255,255,0.3)', fontFamily: FONT_DISPLAY,
                fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase',
                px: 4, py: 1.4, borderRadius: '8px', textDecoration: 'none',
                '&:hover': { borderColor: C.ink, bgcolor: 'rgba(255,255,255,0.06)' },
                transition: 'border-color 0.15s',
              }}>
                Registrieren
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Features ─────────────────────────────────────────────── */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
          <Grid container spacing={3}>
            {features.map(({ icon, title, desc }) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Box sx={{
                  bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px',
                  p: { xs: 3, md: 4 }, height: '100%',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  '&:hover': { borderColor: 'rgba(232,0,13,0.5)', boxShadow: '0 4px 24px rgba(232,0,13,0.08)' },
                }}>
                  <Typography sx={{ fontSize: '2rem', mb: 2 }}>{icon}</Typography>
                  <Typography component="h3" sx={{
                    fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.3rem',
                    textTransform: 'uppercase', color: C.ink, letterSpacing: '0.02em', mb: 1,
                  }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: '0.95rem', color: C.muted, lineHeight: 1.65 }}>
                    {desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <Box component="footer" sx={{ borderTop: `1px solid ${C.border}`, py: 4, bgcolor: C.surface }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
          <Box sx={{
            display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2,
          }}>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '1.3rem', textTransform: 'uppercase', color: C.ink }}>
              Redo<span style={{ color: C.red }}>Go</span>
            </Typography>
            <Typography sx={{ fontFamily: FONT_BODY, fontSize: '0.85rem', color: C.muted }}>
              © 2024 RedoGo · Lokale Gastronomie, neu gedacht.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['Impressum', 'Datenschutz', 'Kontakt'].map((l) => (
                <Typography key={l} component="a" href="#" sx={{
                  fontFamily: FONT_BODY, fontSize: '0.85rem', color: C.muted,
                  textDecoration: 'none', '&:hover': { color: C.ink },
                }}>
                  {l}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
