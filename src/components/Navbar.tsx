import { useEffect, useState } from 'react'
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/img.png'
import { clearUserId, clearUserName, getUserName } from '../services/userSession'

const navLinks: { label: string; to?: string }[] = [
  { label: 'Speisekarte', to: '/menu' },
  { label: 'Standorte', to: '/locations' },
  { label: 'Liefern' },
  { label: 'Abholen' },
  { label: 'Über uns' },
]

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0] ?? '').join('').toUpperCase().slice(0, 2)
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [userName, setUserNameState] = useState<string | null>(getUserName)
  const navigate = useNavigate()

  useEffect(() => {
    const sync = () => setUserNameState(getUserName())
    window.addEventListener('redogo:auth', sync)
    return () => window.removeEventListener('redogo:auth', sync)
  }, [])

  function handleLogout() {
    clearUserId()
    clearUserName()
    navigate('/')
  }

  const authSection = userName ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{
        width: 36, height: 36, borderRadius: '50%', bgcolor: '#e8000d',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Typography sx={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#fff', lineHeight: 1 }}>
          {getInitials(userName)}
        </Typography>
      </Box>
      <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.88rem', color: 'rgba(245,245,245,0.8)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {userName.split(' ')[0]}
      </Typography>
      <Button onClick={handleLogout} sx={{
        color: 'rgba(245,245,245,0.55)', fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase',
        px: 1.5, borderRadius: '6px', minWidth: 0,
        '&:hover': { color: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.06)' },
      }}>
        Abmelden
      </Button>
    </Box>
  ) : (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
      <IconButton component={Link} to="/login" aria-label="Anmelden" sx={{
        width: 36, height: 36, borderRadius: '50%',
        border: '1.5px solid rgba(245,245,245,0.22)',
        color: 'rgba(245,245,245,0.75)',
        '&:hover': { borderColor: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.07)', color: '#f5f5f5' },
        transition: 'all 0.18s',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </IconButton>
      <Button component={Link} to="/register" sx={{
        bgcolor: '#e8000d', color: '#fff',
        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1rem',
        letterSpacing: '0.06em', textTransform: 'uppercase', px: 3, py: 1, borderRadius: '6px',
        textDecoration: 'none',
        '&:hover': { bgcolor: '#c4000b', transform: 'translateY(-1px)', boxShadow: '0 4px 20px rgba(232,0,13,0.35)' },
        transition: 'all 0.18s',
      }}>
        Registrieren
      </Button>
    </Box>
  )

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'rgba(13,13,13,0.96)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(232,0,13,0.25)',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, md: 4 }, py: 1.5, gap: 2 }}>

        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0, textDecoration: 'none' }}>
          <Box component="img" src={logo} alt="RedoGo" sx={{ height: 44, objectFit: 'contain' }} />
          <Typography sx={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.6rem',
            letterSpacing: '0.03em', textTransform: 'uppercase', color: '#f5f5f5', lineHeight: 1,
          }}>
            Redo<span style={{ color: '#e8000d' }}>Go</span>
          </Typography>
        </Box>

        {/* Desktop nav */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3.5, ml: 5, flex: 1 }}>
          {navLinks.map((link) => (
            <Typography
              key={link.label}
              {...(link.to ? { component: Link, to: link.to } : { component: 'a', href: '#' })}
              sx={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.9rem',
                color: 'rgba(245,245,245,0.65)', textDecoration: 'none',
                transition: 'color 0.18s', '&:hover': { color: '#e8000d' },
              }}
            >
              {link.label}
            </Typography>
          ))}
        </Box>

        {/* Desktop auth */}
        <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'flex' } }}>
          {authSection}
        </Box>

        {/* Mobile hamburger */}
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto', color: '#f5f5f5', p: 1 }}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
            <rect y="3" width="22" height="2.2" rx="1.1" />
            <rect y="9.9" width="22" height="2.2" rx="1.1" />
            <rect y="16.8" width="22" height="2.2" rx="1.1" />
          </svg>
        </IconButton>
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { bgcolor: '#111', width: 280, pt: 5, px: 2 } } }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', top: 16, right: 16, color: 'rgba(245,245,245,0.6)' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </IconButton>

        {/* Mobile user greeting */}
        {userName && (
          <Box sx={{ px: 1, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#e8000d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#fff', lineHeight: 1 }}>
                {getInitials(userName)}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: 'rgba(245,245,245,0.8)' }}>
              {userName}
            </Typography>
          </Box>
        )}

        <List sx={{ gap: 0.5 }}>
          {navLinks.map((link) => (
            <ListItem key={link.label} sx={{ py: 1.5, px: 1 }}>
              <Typography
                {...(link.to ? { component: Link, to: link.to } : { component: 'a', href: '#' })}
                onClick={() => setOpen(false)}
                sx={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.6rem',
                  textTransform: 'uppercase', color: 'rgba(245,245,245,0.85)', textDecoration: 'none',
                  letterSpacing: '0.03em', '&:hover': { color: '#e8000d' },
                }}
              >
                {link.label}
              </Typography>
            </ListItem>
          ))}

          {userName ? (
            <ListItem sx={{ pt: 4, px: 1 }}>
              <Button fullWidth onClick={() => { setOpen(false); handleLogout() }} sx={{
                color: '#f5f5f5', borderColor: 'rgba(245,245,245,0.18)', border: '1px solid',
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.1rem',
                textTransform: 'uppercase', letterSpacing: '0.06em', py: 1.5, borderRadius: '6px',
                '&:hover': { borderColor: '#f5f5f5' },
              }}>
                Abmelden
              </Button>
            </ListItem>
          ) : (
            <>
              <ListItem sx={{ pt: 4, px: 1 }}>
                <Button component={Link} to="/login" fullWidth variant="outlined" onClick={() => setOpen(false)} sx={{
                  color: '#f5f5f5', borderColor: 'rgba(245,245,245,0.18)',
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.1rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em', py: 1.5, borderRadius: '6px',
                  textDecoration: 'none', '&:hover': { borderColor: '#f5f5f5' },
                }}>
                  Anmelden
                </Button>
              </ListItem>
              <ListItem sx={{ pt: 1.5, px: 1 }}>
                <Button component={Link} to="/register" fullWidth onClick={() => setOpen(false)} sx={{
                  bgcolor: '#e8000d', color: '#fff',
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.1rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em', py: 1.5, borderRadius: '6px',
                  textDecoration: 'none', '&:hover': { bgcolor: '#c4000b' },
                }}>
                  Registrieren
                </Button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  )
}
