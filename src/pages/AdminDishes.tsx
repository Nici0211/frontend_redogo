import { useEffect, useState } from 'react'
import {
  Alert, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, FormControlLabel, Grid, IconButton, MenuItem,
  Snackbar, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import {
  DESCRIPTION_MAX, EMPTY_DISH_FORM, NAME_MAX, createDish, deleteDish, useOwnRestaurants, validateDishForm,
} from '../services/adminService'
import type { DishFormErrors, DishFormState, EntryKind } from '../services/adminService'
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

const KIND_TEXT: Record<EntryKind, { singular: string; plural: string; article: string; newLabel: string }> = {
  dish: { singular: 'Gericht', plural: 'Gerichte', article: 'das', newLabel: 'Neues Gericht' },
  menu: { singular: 'Menü', plural: 'Menüs', article: 'das', newLabel: 'Neues Menü' },
}

function StatChip({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <Box sx={{
      bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', px: 2.5, py: 1.5, minWidth: 120,
    }}>
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '1.9rem', lineHeight: 1, color: warn && value > 0 ? C.error : C.ink }}>
        {value}
      </Typography>
      <Typography sx={{ fontFamily: FONT_BODY, fontSize: '0.8rem', color: C.muted, mt: 0.5 }}>{label}</Typography>
    </Box>
  )
}

function EntryRow({ entry, onDelete }: { entry: MenuEntry; onDelete: (entry: MenuEntry) => void }) {
  return (
    <Box
      component="li"
      sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', justifyContent: 'space-between', py: 1.75, borderBottom: `1px solid ${C.border}` }}
    >
      <Box sx={{ minWidth: 0, opacity: entry.available ? 1 : 0.6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', color: C.ink, letterSpacing: '0.02em' }}>
            {entry.name}
          </Typography>
          <Box component="span" sx={{
            fontFamily: FONT_BODY, fontSize: '0.7rem', fontWeight: 700, px: 1, py: 0.25, borderRadius: '999px',
            color: entry.available ? C.ok : C.muted,
            border: `1px solid ${entry.available ? 'rgba(74,222,128,0.4)' : C.border}`,
          }}>
            {entry.available ? 'Verfügbar' : 'Nicht verfügbar'}
          </Box>
        </Box>
        {entry.description && (
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: '0.88rem', color: C.muted, mt: 0.25, overflowWrap: 'anywhere' }}>
            {entry.description}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.15rem', color: C.red }}>
          {formatPrice(entry.price)}
        </Typography>
        <IconButton
          aria-label={`${entry.name} löschen`}
          onClick={() => onDelete(entry)}
          size="small"
          sx={{ color: C.muted, '&:hover': { color: C.error, bgcolor: 'rgba(248,113,113,0.1)' } }}
        >
          <Box component="svg" viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </Box>
        </IconButton>
      </Box>
    </Box>
  )
}

function EntrySection({ kind, entries, onDelete }: { kind: EntryKind; entries: MenuEntry[]; onDelete: (entry: MenuEntry) => void }) {
  const text = KIND_TEXT[kind]
  return (
    <Box component="section" sx={{ '& + &': { mt: 4 } }}>
      <Typography component="h3" sx={{
        fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.2rem', textTransform: 'uppercase', color: C.ink,
        letterSpacing: '0.04em', pb: 1, borderBottom: `2px solid ${C.red}`, display: 'flex', justifyContent: 'space-between',
      }}>
        {text.plural}
        <Box component="span" sx={{ color: C.muted }}>{entries.length}</Box>
      </Typography>
      {entries.length === 0 ? (
        <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, py: 2 }}>Noch keine {text.plural} vorhanden.</Typography>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {entries.map((e) => <EntryRow key={e.id} entry={e} onDelete={onDelete} />)}
        </Box>
      )}
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

interface MenuState { id: number; dishes: MenuEntry[]; menus: MenuEntry[] }

function AdminDishesContent() {
  const { restaurants, loading, error, retry } = useOwnRestaurants()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [kind, setKind] = useState<EntryKind>('dish')
  const [form, setForm] = useState<DishFormState>(EMPTY_DISH_FORM)
  const [errors, setErrors] = useState<DishFormErrors>({})
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  // Die Speisekarte gehört immer zu einem Restaurant - so wird beim Wechsel automatisch neu geladen (siehe menuService)
  const [menuState, setMenuState] = useState<MenuState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  // US11: Eintrag, für den gerade die Löschbestätigung offen ist
  const [toDelete, setToDelete] = useState<{ entry: MenuEntry; kind: EntryKind } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Erstes eigenes Restaurant vorauswählen
  const effectiveId: number | null = selectedId ?? (restaurants.length > 0 ? restaurants[0].id : null)

  // Aktuelle Speisekarte des gewählten Restaurants laden
  useEffect(() => {
    if (effectiveId === null) return
    const controller = new AbortController()
    fetchMenu(effectiveId, controller.signal)
      .then((menu) => setMenuState({ id: effectiveId, dishes: menu.dishes, menus: menu.menus }))
      .catch(() => { if (!controller.signal.aborted) setMenuState({ id: effectiveId, dishes: [], menus: [] }) })
    return () => controller.abort()
  }, [effectiveId])

  const current = menuState && menuState.id === effectiveId ? menuState : null
  const dishes = current?.dishes ?? []
  const menus = current?.menus ?? []
  const menuLoading = effectiveId !== null && current === null
  const unavailableCount = [...dishes, ...menus].filter((e) => !e.available).length
  const text = KIND_TEXT[kind]

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
      const created = await createDish(getUserId(), effectiveId, form, kind)
      setMenuState((prev) => {
        const base: MenuState = prev?.id === effectiveId ? prev : { id: effectiveId, dishes: [], menus: [] }
        return kind === 'dish'
          ? { ...base, dishes: [...base.dishes, created] }
          : { ...base, menus: [...base.menus, created] }
      })
      setForm(EMPTY_DISH_FORM)
      setToast(`„${created.name}“ wurde zur Speisekarte hinzugefügt.`)
    } catch (err) {
      setApiError(err instanceof TypeError ? 'Server nicht erreichbar. Bitte versuche es später.' : (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  function closeDeleteDialog() {
    if (deleting) return
    setToDelete(null)
    setDeleteError(null)
  }

  async function handleConfirmDelete() {
    if (effectiveId === null || toDelete === null) return
    const { entry, kind: targetKind } = toDelete
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteDish(getUserId(), effectiveId, entry.id, targetKind)
      setMenuState((prev) => {
        if (!prev || prev.id !== effectiveId) return prev
        return targetKind === 'dish'
          ? { ...prev, dishes: prev.dishes.filter((d) => d.id !== entry.id) }
          : { ...prev, menus: prev.menus.filter((m) => m.id !== entry.id) }
      })
      setToDelete(null)
      setToast(`„${entry.name}“ wurde von der Speisekarte gelöscht.`)
    } catch (err) {
      setDeleteError(err instanceof TypeError ? 'Server nicht erreichbar. Bitte versuche es später.' : (err as Error).message)
    } finally {
      setDeleting(false)
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
      <Typography sx={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '1.05rem', mb: 5 }}>
        Füge Gerichte und Menüs hinzu oder entferne nicht mehr benötigte Einträge.
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
        <>
          {/* Übersicht: Restaurantauswahl + Kennzahlen */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'stretch', mb: 4 }}>
            <TextField
              select label="Restaurant" value={effectiveId ?? ''} sx={{ ...fieldSx, flex: '1 1 280px', maxWidth: 420 }}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              slotProps={{ select: { MenuProps: { slotProps: { paper: { sx: { bgcolor: C.surface, color: C.ink } } } } } }}
            >
              {restaurants.map((r) => (
                <MenuItem key={r.id} value={r.id} sx={{ fontFamily: FONT_BODY }}>{r.name}</MenuItem>
              ))}
            </TextField>
            <StatChip label="Gerichte" value={dishes.length} />
            <StatChip label="Menüs" value={menus.length} />
            <StatChip label="Nicht verfügbar" value={unavailableCount} warn />
          </Box>

          <Grid container spacing={4}>
            {/* Formular */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{
                bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px',
                p: { xs: 3, md: 4 }, boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
                display: 'flex', flexDirection: 'column', gap: 2.5,
              }}>
                <Typography component="h2" sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.6rem', textTransform: 'uppercase', color: C.ink }}>
                  {text.newLabel}
                </Typography>

                <ToggleButtonGroup
                  exclusive fullWidth value={kind} aria-label="Art des Eintrags"
                  onChange={(_, value: EntryKind | null) => { if (value) { setKind(value); setApiError(null) } }}
                  sx={{
                    '& .MuiToggleButton-root': {
                      fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: C.muted, borderColor: C.border, py: 1,
                      '&.Mui-selected': { bgcolor: C.red, color: '#fff', '&:hover': { bgcolor: C.redDark } },
                    },
                  }}
                >
                  <ToggleButton value="dish">Gericht</ToggleButton>
                  <ToggleButton value="menu">Menü</ToggleButton>
                </ToggleButtonGroup>

                <TextField
                  label="Name" value={form.name} onChange={handleChange('name')}
                  error={!!errors.name} helperText={errors.name} required fullWidth sx={fieldSx}
                  slotProps={{ htmlInput: { maxLength: NAME_MAX } }}
                />

                <TextField
                  label={kind === 'menu' ? 'Beschreibung (z. B. enthaltene Gerichte)' : 'Beschreibung'}
                  value={form.description} onChange={handleChange('description')}
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
                  {saving ? <CircularProgress size={22} sx={{ color: C.muted }} /> : `${text.singular} hinzufügen`}
                </Button>
              </Box>
            </Grid>

            {/* Aktuelle Speisekarte */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', p: { xs: 3, md: 4 } }}>
                <Typography component="h2" sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.6rem', textTransform: 'uppercase', color: C.ink, mb: 2.5 }}>
                  Aktuelle Speisekarte
                </Typography>

                {menuLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={28} aria-label="Speisekarte laden" sx={{ color: C.red }} />
                  </Box>
                ) : (
                  <>
                    <EntrySection kind="dish" entries={dishes} onDelete={(entry) => setToDelete({ entry, kind: 'dish' })} />
                    <EntrySection kind="menu" entries={menus} onDelete={(entry) => setToDelete({ entry, kind: 'menu' })} />
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </>
      )}

      <Dialog
        open={toDelete !== null}
        onClose={closeDeleteDialog}
        slotProps={{ paper: { sx: { bgcolor: C.surface, color: C.ink, borderRadius: '16px', border: `1px solid ${C.border}` } } }}
      >
        <DialogTitle sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.5rem', textTransform: 'uppercase' }}>
          {toDelete ? KIND_TEXT[toDelete.kind].singular : 'Eintrag'} löschen?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: FONT_BODY, color: C.muted }}>
            „{toDelete?.entry.name}“ wird endgültig von der Speisekarte entfernt und aus allen Warenkörben gelöscht.
          </DialogContentText>
          {deleteError && (
            <Box role="alert" sx={{ mt: 2, bgcolor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', px: 2, py: 1.5 }}>
              <Typography sx={{ fontFamily: FONT_BODY, color: C.error, fontSize: '0.9rem' }}>{deleteError}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDeleteDialog} disabled={deleting} sx={{ fontFamily: FONT_BODY, color: C.muted }}>
            Abbrechen
          </Button>
          <Button onClick={handleConfirmDelete} disabled={deleting} sx={{ ...primaryButtonSx, py: 1, px: 3 }}>
            {deleting ? <CircularProgress size={20} sx={{ color: C.muted }} /> : 'Löschen'}
          </Button>
        </DialogActions>
      </Dialog>

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
