import { useState } from 'react'
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem } from '@mui/material'
import logo from '../assets/img.png'

const navLinks = ['Speisekarte', 'Liefern', 'Abholen', 'Über uns']

export default function Navbar() {
  const [open, setOpen] = useState(false)

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
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: 1.5,
          gap: 2,
        }}
      >
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Box
            component="img"
            src={logo}
            alt="RedoGo"
            sx={{ height: 44, objectFit: 'contain' }}
          />
          <Typography
            sx={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: '1.6rem',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              color: '#f5f5f5',
              lineHeight: 1,
            }}
          >
            Redo<span style={{ color: '#e8000d' }}>Go</span>
          </Typography>
        </Box>

        {/* Desktop nav */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3.5, ml: 5, flex: 1 }}>
          {navLinks.map((link) => (
            <Typography
              key={link}
              component="a"
              href="#"
              sx={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'rgba(245,245,245,0.65)',
                textDecoration: 'none',
                transition: 'color 0.18s',
                '&:hover': { color: '#e8000d' },
              }}
            >
              {link}
            </Typography>
          ))}
        </Box>

        {/* CTA */}
        <Button
          sx={{
            ml: 'auto',
            display: { xs: 'none', md: 'flex' },
            bgcolor: '#e8000d',
            color: '#fff',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            px: 3,
            py: 1,
            borderRadius: '6px',
            '&:hover': { bgcolor: '#c4000b', transform: 'translateY(-1px)', boxShadow: '0 4px 20px rgba(232,0,13,0.35)' },
            transition: 'all 0.18s',
          }}
        >
          Jetzt bestellen
        </Button>

        {/* Mobile hamburger */}
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto', color: '#f5f5f5', p: 1 }}
          aria-label="Menü öffnen"
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
        <List sx={{ gap: 0.5 }}>
          {navLinks.map((link) => (
            <ListItem key={link} sx={{ py: 1.5, px: 1 }}>
              <Typography
                component="a"
                href="#"
                sx={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.6rem',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,245,0.85)',
                  textDecoration: 'none',
                  letterSpacing: '0.03em',
                  '&:hover': { color: '#e8000d' },
                }}
              >
                {link}
              </Typography>
            </ListItem>
          ))}
          <ListItem sx={{ pt: 4, px: 1 }}>
            <Button
              fullWidth
              sx={{
                bgcolor: '#e8000d',
                color: '#fff',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                py: 1.5,
                borderRadius: '6px',
                '&:hover': { bgcolor: '#c4000b' },
              }}
            >
              Jetzt bestellen
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  )
}
