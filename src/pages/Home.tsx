import { Box, Typography, Button, Container } from '@mui/material'

// ─── Tokens ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#0d0d0d',
  surface: '#141414',
  surface2: '#1a1a1a',
  border: 'rgba(255,255,255,0.08)',
  red: '#e8000d',
  redDark: '#c4000b',
  redGlow: 'rgba(232,0,13,0.18)',
  amber: '#f59e0b',
  amberDim: 'rgba(245,158,11,0.12)',
  ink: '#f5f5f5',
  muted: 'rgba(245,245,245,0.55)',
  subtle: 'rgba(245,245,245,0.18)',
}

const FONT_DISPLAY = "'Barlow Condensed', sans-serif"
const FONT_BODY = "'Nunito', sans-serif"

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconDelivery() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M3 12h20l4 8H3V12z" fill={C.red} opacity="0.9" />
      <path d="M23 20l3-8h4l3 8" stroke={C.red} strokeWidth="2" fill="none" />
      <circle cx="9" cy="24" r="3" fill={C.red} />
      <circle cx="26" cy="24" r="3" fill={C.red} />
    </svg>
  )
}

function IconPickup() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="8" y="14" width="20" height="16" rx="2" fill={C.amber} opacity="0.9" />
      <path d="M14 14v-4a4 4 0 0 1 8 0v4" stroke={C.amber} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function IconFresh() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" fill={C.red} opacity="0.15" />
      <path d="M14 6c0 0-6 5-6 10a6 6 0 0 0 12 0c0-5-6-10-6-10z" fill={C.red} />
      <path d="M14 14v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconFast() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" fill={C.amber} opacity="0.15" />
      <path d="M9 14l3-5 2 3 3-6 2 4h3" stroke={C.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" fill={C.red} opacity="0.15" />
      <rect x="8" y="10" width="12" height="10" rx="1.5" stroke={C.red} strokeWidth="1.5" fill="none" />
      <path d="M11 8v3M17 8v3M8 14h12" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: { xs: 'auto', md: '92vh' },
        bgcolor: C.bg,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 8, md: 0 },
        pb: { xs: 8, md: 0 },
      }}
    >
      {/* Background accent */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-5%',
          width: { xs: '60%', md: '45%' },
          height: '140%',
          background: `radial-gradient(ellipse at 80% 40%, rgba(232,0,13,0.08) 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 6, md: 6 },
          }}
        >
          {/* Text side */}
          <Box sx={{ flex: '0 0 auto', width: { xs: '100%', md: '52%' } }}>

            <Typography
              component="h1"
              className="anim-fade-up-1"
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 900,
                fontSize: { xs: 'clamp(2.8rem, 10vw, 4.8rem)', md: 'clamp(3.2rem, 5.5vw, 5.2rem)' },
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: C.ink,
                textWrap: 'balance',
                mb: 2.5,
              }}
            >
              Frisches Essen.{' '}
              <Box component="span" sx={{ color: C.red }}>
                Direkt
              </Box>{' '}
              aus der Nachbarschaft.
            </Typography>

            <Typography
              className="anim-fade-up-2"
              sx={{
                fontFamily: FONT_BODY,
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: C.muted,
                maxWidth: '48ch',
                mb: 4,
              }}
            >
              Bestelle dein Lieblingsessen aus lokalen Restaurants — zur Lieferung nach Hause oder
              zur Abholung vor Ort. Einfach, schnell, lokal.
            </Typography>

            <Box className="anim-fade-up-3" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                sx={{
                  bgcolor: C.red,
                  color: '#fff',
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  px: 4,
                  py: 1.4,
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: C.redDark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 28px rgba(232,0,13,0.35)`,
                  },
                  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                Jetzt bestellen
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: C.ink,
                  borderColor: C.subtle,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  px: 4,
                  py: 1.4,
                  borderRadius: '8px',
                  '&:hover': {
                    borderColor: C.ink,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                Tisch reservieren
              </Button>
            </Box>

            {/* Stats */}
            <Box
              className="anim-fade-up-3"
              sx={{
                display: 'flex',
                gap: 4,
                mt: 5,
                pt: 4,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              {[
                { value: '50+', label: 'Restaurants' },
                { value: '30 min', label: 'Ø Lieferzeit' },
                { value: '4.8★', label: 'Bewertung' },
              ].map(({ value, label }) => (
                <Box key={label}>
                  <Typography
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 900,
                      fontSize: '1.8rem',
                      color: C.ink,
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography
                    sx={{ fontFamily: FONT_BODY, fontSize: '0.8rem', color: C.muted, mt: 0.3 }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Image side */}
          <Box
            className="anim-scale-in"
            sx={{ flex: 1, display: { xs: 'none', md: 'block' }, position: 'relative' }}
          >
            <Box
              sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '4/5',
                maxWidth: 420,
                mx: 'auto',
                position: 'relative',
                boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${C.border}`,
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=840&q=82"
                alt="Frische lokale Pizza aus dem Holzofen"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Overlay gradient */}
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(13,13,13,0.5) 0%, transparent 50%)',
                }}
              />
            </Box>

            {/* Floating delivery badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 40,
                left: -20,
                bgcolor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                px: 2.5,
                py: 1.8,
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: C.redGlow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                }}
              >
                🛵
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: C.ink,
                    lineHeight: 1.1,
                  }}
                >
                  30 Min
                </Typography>
                <Typography
                  sx={{ fontFamily: FONT_BODY, fontSize: '0.75rem', color: C.muted }}
                >
                  Lieferzeit
                </Typography>
              </Box>
            </Box>

            {/* Floating rating badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 24,
                right: -10,
                bgcolor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                px: 2,
                py: 1.5,
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: C.amber,
                  lineHeight: 1,
                }}
              >
                ★ 4.9
              </Typography>
              <Typography
                sx={{ fontFamily: FONT_BODY, fontSize: '0.7rem', color: C.muted, mt: 0.2 }}
              >
                Top bewertet
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  return (
    <Box component="section" sx={{ bgcolor: C.surface, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          {/* Delivery card */}
          <Box
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              minHeight: 360,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              cursor: 'pointer',
              '&:hover .card-img': { transform: 'scale(1.04)' },
              '&:hover .card-btn': { bgcolor: C.redDark },
            }}
          >
            <Box
              className="card-img"
              component="img"
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80"
              alt="Pizza Lieferservice"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.3) 55%, transparent 100%)',
              }}
            />
            <Box sx={{ position: 'relative', p: { xs: 3, md: 4 } }}>
              <Box sx={{ mb: 1.5 }}>
                <IconDelivery />
              </Box>
              <Typography
                component="h3"
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 900,
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  textTransform: 'uppercase',
                  color: C.ink,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                Lieferservice
              </Typography>
              <Typography
                sx={{ fontFamily: FONT_BODY, fontSize: '0.95rem', color: 'rgba(245,245,245,0.7)', mb: 3 }}
              >
                Frisches Essen direkt an deine Tür. Ab 2,90 € Liefergebühr.
              </Typography>
              <Button
                className="card-btn"
                sx={{
                  bgcolor: C.red,
                  color: '#fff',
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  px: 3,
                  py: 1,
                  borderRadius: '6px',
                  transition: 'background 0.18s',
                }}
              >
                Jetzt bestellen →
              </Button>
            </Box>
          </Box>

          {/* Pickup card */}
          <Box
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              minHeight: 360,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              cursor: 'pointer',
              '&:hover .card-img2': { transform: 'scale(1.04)' },
              '&:hover .card-btn2': { bgcolor: '#d97706' },
            }}
          >
            <Box
              className="card-img2"
              component="img"
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80"
              alt="Restaurant Tisch Abendessen"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.3) 55%, transparent 100%)',
              }}
            />
            <Box sx={{ position: 'relative', p: { xs: 3, md: 4 } }}>
              <Box sx={{ mb: 1.5 }}>
                <IconPickup />
              </Box>
              <Typography
                component="h3"
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 900,
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  textTransform: 'uppercase',
                  color: C.ink,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                Vor-Ort & Abholung
              </Typography>
              <Typography
                sx={{ fontFamily: FONT_BODY, fontSize: '0.95rem', color: 'rgba(245,245,245,0.7)', mb: 3 }}
              >
                Tisch reservieren, vorab bestellen, ankommen und genießen.
              </Typography>
              <Button
                className="card-btn2"
                sx={{
                  bgcolor: C.amber,
                  color: '#111',
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  px: 3,
                  py: 1,
                  borderRadius: '6px',
                  transition: 'background 0.18s',
                }}
              >
                Tisch reservieren →
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'Restaurant entdecken',
      desc: 'Durchstöbere lokale Restaurants und Speisekarten in deiner Nähe.',
    },
    {
      n: '2',
      title: 'Gericht wählen',
      desc: 'Wähle was du möchtest — zur Lieferung, Abholung oder direkt im Lokal.',
    },
    {
      n: '3',
      title: 'Genießen',
      desc: 'Verfolge deine Bestellung live oder erscheine einfach zum reservierten Tisch.',
    },
  ]

  return (
    <Box component="section" sx={{ bgcolor: C.bg, py: { xs: 8, md: 14 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 5 } }}>
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              textTransform: 'uppercase',
              color: C.ink,
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              textWrap: 'balance',
            }}
          >
            Einfacher geht's{' '}
            <Box component="span" sx={{ color: C.red }}>
              nicht.
            </Box>
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 4, md: 3 },
            position: 'relative',
          }}
        >
          {/* Connector line desktop */}
          <Box
            aria-hidden
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: 36,
              left: 'calc(16.6% + 20px)',
              right: 'calc(16.6% + 20px)',
              height: '1px',
              background: `linear-gradient(to right, ${C.red}, rgba(232,0,13,0.2))`,
            }}
          />

          {steps.map(({ n, title, desc }) => (
            <Box key={n}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '14px',
                  bgcolor: n === '1' ? C.red : C.surface2,
                  border: n !== '1' ? `1px solid ${C.border}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 900,
                    fontSize: '1.8rem',
                    color: n === '1' ? '#fff' : C.muted,
                    lineHeight: 1,
                  }}
                >
                  {n}
                </Typography>
              </Box>
              <Typography
                component="h3"
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  textTransform: 'uppercase',
                  color: C.ink,
                  letterSpacing: '0.01em',
                  mb: 1.5,
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: C.muted,
                  maxWidth: '34ch',
                }}
              >
                {desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const items = [
    {
      Icon: IconFresh,
      title: 'Frisch & Lokal',
      desc: 'Nur Restaurants aus deiner Umgebung. Kürzere Wege, frischeres Essen, lokale Wirtschaft stärken.',
      accent: C.red,
    },
    {
      Icon: IconFast,
      title: 'Blitzschnell',
      desc: 'Durchschnittlich 30 Minuten Lieferzeit. Live-Tracking zeigt dir, wo dein Essen gerade ist.',
      accent: C.amber,
    },
    {
      Icon: IconCalendar,
      title: 'Für später planen',
      desc: 'Tisch und Bestellung im Voraus aufgeben. Ankomme und genieße — ohne Wartezeit.',
      accent: C.red,
    },
  ]

  return (
    <Box component="section" sx={{ bgcolor: C.surface, py: { xs: 8, md: 14 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {items.map(({ Icon, title, desc, accent }) => (
            <Box
              key={title}
              sx={{
                bgcolor: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: '14px',
                p: { xs: 3, md: 4 },
                transition: 'border-color 0.2s, transform 0.2s',
                '&:hover': {
                  borderColor: `${accent}50`,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box sx={{ mb: 2.5 }}>
                <Icon />
              </Box>
              <Typography
                component="h3"
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  textTransform: 'uppercase',
                  color: C.ink,
                  letterSpacing: '0.02em',
                  mb: 1.5,
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: C.muted,
                }}
              >
                {desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: C.bg,
        py: { xs: 8, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=70)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, rgba(232,0,13,0.06) 0%, transparent 70%)`,
        }}
      />
      <Container maxWidth="md" sx={{ px: { xs: 3, md: 5 }, position: 'relative', textAlign: 'center' }}>
        <Typography
          component="h2"
          sx={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 'clamp(2.6rem, 6vw, 5rem)',
            textTransform: 'uppercase',
            color: C.ink,
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            textWrap: 'balance',
            mb: 3,
          }}
        >
          Bereit zum{' '}
          <Box component="span" sx={{ color: C.red }}>
            Bestellen?
          </Box>
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_BODY,
            fontSize: '1.05rem',
            color: C.muted,
            lineHeight: 1.65,
            maxWidth: '42ch',
            mx: 'auto',
            mb: 5,
          }}
        >
          Entdecke die besten lokalen Restaurants in deiner Stadt. Kostenlos, ohne Anmeldung stöbern.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            sx={{
              bgcolor: C.red,
              color: '#fff',
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: '1.1rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              px: 5,
              py: 1.6,
              borderRadius: '8px',
              '&:hover': {
                bgcolor: C.redDark,
                transform: 'translateY(-2px)',
                boxShadow: `0 10px 32px rgba(232,0,13,0.35)`,
              },
              transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            Restaurants entdecken
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: C.ink,
              borderColor: C.subtle,
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              px: 5,
              py: 1.6,
              borderRadius: '8px',
              '&:hover': { borderColor: C.ink, bgcolor: 'rgba(255,255,255,0.05)' },
              transition: 'all 0.2s',
            }}
          >
            Tisch reservieren
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: C.surface,
        borderTop: `1px solid ${C.border}`,
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: '1.3rem',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              color: C.ink,
            }}
          >
            Redo<span style={{ color: C.red }}>Go</span>
          </Typography>
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: '0.85rem', color: C.muted }}>
            © 2024 RedoGo · Lokale Gastronomie, neu gedacht.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Impressum', 'Datenschutz', 'Kontakt'].map((l) => (
              <Typography
                key={l}
                component="a"
                href="#"
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: '0.85rem',
                  color: C.muted,
                  textDecoration: 'none',
                  '&:hover': { color: C.ink },
                }}
              >
                {l}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <Box sx={{ bgcolor: C.bg, minHeight: '100vh' }}>
      <Hero />
      <Services />
      <HowItWorks />
      <Features />
      <CTABanner />
      <Footer />
    </Box>
  )
}
