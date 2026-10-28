import { useEffect, useState } from 'react'
import {
  Alert, Box, Button, CircularProgress, Container, FormControlLabel, Grid, MenuItem,
  Snackbar, Switch, TextField, Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import {
  DESCRIPTION_MAX, EMPTY_DISH_FORM, NAME_MAX, createDish, useOwnRestaurants, validateDishForm,
} from '../services/adminService'
import type { DishFormErrors, DishFormState } from '../services/adminService'
import { fetchMenu, formatPrice } from '../services/menuService'
import type { MenuEntry } from '../services/menuService'
import { getUserId, getUserName, isAdmin } from '../services/userSession'

const C = {
  bg: '#18181b', surface: '#27272a', surface2: '#3f3f46',
  border: 'rgba(255,255,255,0.1)', borderHover: 'rgba(255,255,255,0.22)',
  red: '#e8000d', redDark: '#c4000b',
  ink: '#f4f4f5', muted: '#a1a1aa',
  error: '#f87171', ok: '#4ade80',
}

const FONT_DISPLAY = "'Barlow Condensed', sans-serif"
const FONT_BODY = "'Nunito', sans-serif"

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: FONT_BODY, color: C.ink, bgcolor: C.surface2, borderRadius: '8px',
    '& fieldset': { borderColor: C.border },
    '&:hover fieldset': { borderColor: C.borderHover },
    '&.Mui-focused fieldset': { borderColor: C.red, borderWidth: '2px' },
    '& input, & textarea': { caretColor: C.red, color: C.ink },
  },
  '& .MuiInputLabel-root': { fontFamily: FONT_BODY, color: C.muted, '&.Mui-focused': { color: C.red } },
  '& .MuiFormHelperText-root': { fontFamily: FONT_BODY, color: C.muted, mt: 0.5, '&.Mui-error': { color: C.error } },
  '& .MuiSelect-icon': { color: C.muted },
}

const primaryButtonSx = {
  bgcolor: C.red, color: '#fff', fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1rem',
  letterSpacing: '0.06em', textTransform: 'uppercase', py: 1.5, borderRadius: '8px',
  '&:hover': { bgcolor: C.redDark },
  '&.Mui-disabled': { bgcolor: C.surface2, color: C.muted },
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Box component="main" sx={{ bgcolor: C.bg, minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>{children}</Container>
    </Box>
  )
}

function Notice({ title, text, linkTo, linkLabel }: { title: string; text: string; linkTo: string; linkLabel: string }) {
  return (
    <Shell>
      <Box role="alert" sx={{ maxWidth: 520, mx: 'auto', textAlign: 'center', py: 8 }}>
        <Typography component="h1" sx={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '2.4rem', textTransform: 'uppercase', color: C.ink, mb: 1.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, mb: 4 }}>{text}</Typography>
        <Button component={Link} to={linkTo} sx={{ ...primaryButtonSx, px: 4, textDecoration: 'none' }}>
          {linkLabel}
        </Button>
      </Box>
    </Shell>
  )
}

function DishRow({ dish }: { dish: MenuEntry }) {
  return (
    <Box
      component="li"
      sx={{
        display: 'flex', gap: 2, alignItems: 'baseline', justifyContent: 'space-between',
        py: 1.5, borderBottom: `1px solid ${C.border}`, opacity: dish.available ? 1 : 0.55,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', color: C.ink, letterSpacing: '0.02em' }}>
          {dish.name}
        </Typography>
        {!dish.available && (
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: '0.8rem', color: C.muted }}>Nicht verfügbar</Typography>
        )}
      </Box>
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.15rem', color: C.red, flexShrink: 0 }}>
        {formatPrice(dish.price)}
      </Typography>
    </Box>
  )
}

export default function AdminDishes() {
  const loggedIn = getUserName() !== null
  const admin = loggedIn && isAdmin()

  if (!loggedIn) {
    return <Notice title="Bitte anmelden" text="Der Admin-Bereich ist nur für angemeldete Restaurantinhaber." linkTo="/login" linkLabel="Zur Anmeldung" />
  }
  if (!admin) {
    return <Notice title="Kein Zugriff" text="Dieser Bereich ist nur für Restaurantinhaber (Admin) gedacht." linkTo="/" linkLabel="Zur Startseite" />
  }
  return <AdminDishesContent />
}

function AdminDishesContent() {
  const { restaurants, loading, error, retry } = useOwnRestaurants()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<DishFormState>(EMPTY_DISH_FORM)
  const [errors, setErrors] = useState<DishFormErrors>({})
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  // Gerichte gehören immer zu einem Restaurant - so wird beim Wechsel automatisch neu geladen (siehe menuService)
  const [dishResult, setDishResult] = useState<{ id: number; dishes: MenuEntry[] } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Erstes eigenes Restaurant vorauswählen
  const effectiveId: number | null = selectedId ?? (restaurants.length > 0 ? restaurants[0].id : null)
  const selected = restaurants.find((r) => r.id === effectiveId) ?? null

  // Aktuelle Gerichte des gewählten Restaurants laden
  useEffect(() => {
    if (effectiveId === null) return
    const controller = new AbortController()
    fetchMenu(effectiveId, controller.signal)
      .then((menu) => setDishResult({ id: effectiveId, dishes: menu.dishes }))
      .catch(() => { if (!controller.signal.aborted) setDishResult({ id: effectiveId, dishes: [] }) })
    return () => controller.abort()
  }, [effectiveId])

  const current = dishResult && dishResult.id === effectiveId ? dishResult : null
  const dishes = current?.dishes ?? []
  const dishesLoading = effectiveId !== null && current === null

  function handleChange(field: 'name' | 'description' | 'price') {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      setApiError(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (effectiveId === null) return
    const errs = validateDishForm(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true)
    setApiError(null)
    try {
      const created = await createDish(getUserId(), effectiveId, form)
      setDishResult((prev) => ({ id: effectiveId, dishes: [...(prev?.id === effectiveId ? prev.dishes : []), created] }))
      setForm(EMPTY_DISH_FORM)
      setToast(`„${created.name}“ wurde zur Speisekarte hinzugefügt.`)
    } catch (err) {
      setApiError(err instanceof TypeError ? 'Server nicht erreichbar. Bitte versuche es später.' : (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Shell>
      <Typography component="h1" sx={{
        fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: { xs: '2.4rem', md: '3.4rem' },
        textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1, color: C.ink, mb: 1.5,
      }}>
        Speisekarte <Box component="span" sx={{ color: C.red }}>verwalten</Box>
      </Typography>
      <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '1.05rem', mb: 6 }}>
        Füge neue Gerichte zur Speisekarte deines Restaurants hinzu.
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress aria-label="Restaurants laden" sx={{ color: C.red }} />
        </Box>
      )}

      {!loading && error && (
        <Box role="alert" sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ fontFamily: FONT_BODY, color: C.error, mb: 3 }}>{error}</Typography>
          <Button onClick={retry} sx={{ ...primaryButtonSx, px: 4 }}>Erneut versuchen</Button>
        </Box>
      )}

      {!loading && !error && restaurants.length === 0 && (
        <Typography sx={{ fontFamily: FONT_BODY, color: C.muted }}>
          Dir ist aktuell kein Restaurant zugeordnet.
        </Typography>
      )}

      {!loading && !error && restaurants.length > 0 && (
        <Grid container spacing={4}>
          {/* Formular */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{
              bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px',
              p: { xs: 3, md: 4 }, boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
              display: 'flex', flexDirection: 'column', gap: 2.5,
            }}>
              <Typography component="h2" sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.6rem', textTransform: 'uppercase', color: C.ink }}>
                Neues Gericht
              </Typography>

              <TextField
                select label="Restaurant" value={effectiveId ?? ''} fullWidth sx={fieldSx}
                onChange={(e) => setSelectedId(Number(e.target.value))}
                slotProps={{ select: { MenuProps: { slotProps: { paper: { sx: { bgcolor: C.surface, color: C.ink } } } } } }}
              >
                {restaurants.map((r) => (
                  <MenuItem key={r.id} value={r.id} sx={{ fontFamily: FONT_BODY }}>{r.name}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Name" value={form.name} onChange={handleChange('name')}
                error={!!errors.name} helperText={errors.name} required fullWidth sx={fieldSx}
                slotProps={{ htmlInput: { maxLength: NAME_MAX } }}
              />

              <TextField
                label="Beschreibung" value={form.description} onChange={handleChange('description')}
                error={!!errors.description}
                helperText={errors.description ?? `${form.description.length}/${DESCRIPTION_MAX}`}
                multiline minRows={3} fullWidth sx={fieldSx}
                slotProps={{ htmlInput: { maxLength: DESCRIPTION_MAX } }}
              />

              <TextField
                label="Preis (€)" value={form.price} onChange={handleChange('price')}
                error={!!errors.price} helperText={errors.price ?? 'z. B. 9,50'} required fullWidth sx={fieldSx}
                slotProps={{ htmlInput: { inputMode: 'decimal' } }}
              />

              <FormControlLabel
                label={<Typography sx={{ fontFamily: FONT_BODY, color: C.ink }}>Sofort verfügbar</Typography>}
                control={
                  <Switch
                    checked={form.available}
                    onChange={(e) => setForm((prev) => ({ ...prev, available: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: C.red },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: C.red },
                    }}
                  />
                }
              />

              {apiError && (
                <Box role="alert" sx={{ bgcolor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', px: 2, py: 1.5 }}>
                  <Typography sx={{ fontFamily: FONT_BODY, color: C.error, fontSize: '0.9rem' }}>{apiError}</Typography>
                </Box>
              )}

              <Button type="submit" fullWidth disabled={saving} sx={primaryButtonSx}>
                {saving ? <CircularProgress size={22} sx={{ color: C.muted }} /> : 'Gericht hinzufügen'}
              </Button>
            </Box>
          </Grid>

          {/* Aktuelle Speisekarte */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', p: { xs: 3, md: 4 } }}>
              <Typography component="h2" sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.6rem', textTransform: 'uppercase', color: C.ink }}>
                Aktuelle Gerichte
              </Typography>
              {selected && (
                <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '0.92rem', mb: 2 }}>
                  {selected.name}
                </Typography>
              )}

              {dishesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={28} aria-label="Gerichte laden" sx={{ color: C.red }} />
                </Box>
              ) : dishes.length === 0 ? (
                <Typography sx={{ fontFamily: FONT_BODY, color: C.muted }}>Noch keine Gerichte vorhanden.</Typography>
              ) : (
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {dishes.map((d) => <DishRow key={d.id} dish={d} />)}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={toast !== null}
        autoHideDuration={4000}
        onClose={(_, reason) => { if (reason !== 'clickaway') setToast(null) }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setToast(null)} severity="success" variant="filled" sx={{ fontFamily: FONT_BODY }}>
          {toast}
        </Alert>
      </Snackbar>
    </Shell>
  )
}
