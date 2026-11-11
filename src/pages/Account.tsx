import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Divider } from '@mui/material'
import { getUserName, getUserData } from '../services/userSession'

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <Box sx={{ py: 1.5 }}>
      <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'rgba(245,245,245,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.4 }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontSize: '1rem', fontWeight: 600, color: 'rgba(245,245,245,0.9)' }}>
        {value}
      </Typography>
    </Box>
  )
}

export default function Account() {
  const navigate = useNavigate()
  const name = getUserName()
  const user = getUserData()

  useEffect(() => {
    if (!name) navigate('/login')
  }, [name, navigate])

  if (!name) return null

  const address = [
    user?.strasse && user?.hausnummer ? `${user.strasse} ${user.hausnummer}` : user?.strasse,
    user?.plz && user?.ort ? `${user.plz} ${user.ort}` : user?.ort,
  ].filter(Boolean).join(', ')

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d0d0d', pt: { xs: 4, md: 7 }, pb: 10, px: 2 }}>
      <Box sx={{ maxWidth: 560, mx: 'auto' }}>
        <Typography sx={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
          fontSize: { xs: '2rem', md: '2.6rem' }, textTransform: 'uppercase',
          letterSpacing: '0.03em', color: '#f5f5f5', mb: 1,
        }}>
          Mein <span style={{ color: '#e8000d' }}>Konto</span>
        </Typography>

        <Box sx={{ bgcolor: '#1a1a1a', border: '1px solid rgba(232,0,13,0.18)', borderRadius: '10px', p: { xs: 2.5, md: 3.5 }, mt: 3 }}>
          <Field label="Vorname" value={user?.vorname} />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <Field label="Nachname" value={user?.nachname} />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <Field label="E-Mail" value={user?.email} />
          {user?.telefon && <><Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} /><Field label="Telefon" value={user.telefon} /></>}
          {address && (
            <>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
              <Field label="Adresse" value={address} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}
