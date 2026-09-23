import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import logo from '../assets/img.png'

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: '#0d0d0d', borderBottom: '3px solid #e8000d' }}>
      <Toolbar sx={{ justifyContent: 'center', gap: 1 }}>
        <Box component="img" src={logo} alt="RedoGo logo" sx={{ height: 70, objectFit: 'contain' }} />
        <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
          Redo<span style={{ color: '#e8000d' }}>Go</span>
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
