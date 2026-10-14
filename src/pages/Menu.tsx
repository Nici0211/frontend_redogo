import { useState } from 'react'
import { Alert, Box, Typography, Button, Container, Grid, CircularProgress, IconButton, Snackbar } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import CartDrawer from '../components/CartDrawer'
import { formatPrice, useMenu } from '../services/menuService'
import type { MenuEntry } from '../services/menuService'
import { MAX_QUANTITY, cartItemCount, useCart } from '../services/cartService'
import type { CartItemType } from '../services/cartService'

const C = {
  bg: '#18181b',
  surface: '#27272a',
  surface2: '#3f3f46',
  border: 'rgba(255,255,255,0.08)',
  red: '#e8000d',
  redDark: '#c4000b',
  ink: '#f4f4f5',
  muted: '#a1a1aa',
  error: '#f87171',
}

const FONT_DISPLAY = "'Barlow Condensed', sans-serif"
const FONT_BODY = "'Nunito', sans-serif"

function CartIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 3h2.4l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L20 7H5.2"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="19.5" r="1.6" fill="currentColor" />
      <circle cx="17" cy="19.5" r="1.6" fill="currentColor" />
    </svg>
  )
}

type AddHandler = (type: CartItemType, entry: MenuEntry, quantity: number) => Promise<boolean>

interface EntryCardProps {
  entry: MenuEntry
  type: CartItemType
  adding: boolean // genau dieser Artikel wird gerade hinzugefügt
  busy: boolean // irgendein Artikel wird gerade hinzugefügt
  onAdd: AddHandler
}

function EntryCard({ entry: e, type, adding, busy, onAdd }: EntryCardProps) {
  const [quantity, setQuantity] = useState(1)

  async function handleAdd() {
    const ok = await onAdd(type, e, quantity)
    if (ok) setQuantity(1)
  }

  const stepperSx = {
    color: C.ink, bgcolor: C.surface2, borderRadius: '8px', width: 36, height: 36,
    fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.3rem', lineHeight: 1,
    '&:hover': { bgcolor: '#52525b' },
    '&.Mui-disabled': { color: C.muted, opacity: 0.5 },
  }

  return (
    <Box
      component="article"
      sx={{
        bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px',
        p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column',
        opacity: e.available ? 1 : 0.6,
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
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.4rem', color: C.red, mt: 'auto', mb: 2 }}>
        {formatPrice(e.price)}
      </Typography>

      {e.available ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} role="group" aria-label={`Menge für ${e.name}`}>
            <IconButton
              aria-label="Menge verringern"
              disabled={busy || quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              sx={stepperSx}
            >
              −
            </IconButton>
            <Typography
              aria-live="polite"
              sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.2rem', color: C.ink, minWidth: 28, textAlign: 'center' }}
            >
              {quantity}
            </Typography>
            <IconButton
              aria-label="Menge erhöhen"
              disabled={busy || quantity >= MAX_QUANTITY}
              onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
              sx={stepperSx}
            >
              +
            </IconButton>
          </Box>
          <Button
            onClick={handleAdd}
            disabled={busy}
            aria-label={`${e.name} in den Warenkorb legen`}
            title="In den Warenkorb"
            sx={{
              ml: 'auto', minWidth: 56, height: 44, px: 2, bgcolor: C.red, color: '#fff', borderRadius: '8px',
              '&:hover': { bgcolor: C.redDark },
              '&.Mui-disabled': { bgcolor: C.surface2, color: C.muted },
            }}
          >
            {adding ? <CircularProgress size={20} sx={{ color: 'inherit' }} /> : <CartIcon />}
          </Button>
        </Box>
      ) : (
        <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: '0.9rem', color: C.muted }}>
          Derzeit nicht verfügbar
        </Typography>
      )}
    </Box>
  )
}

interface SectionProps {
  title: string
  entries: MenuEntry[]
  emptyText: string
  type: CartItemType
  addingKey: string | null
  onAdd: AddHandler
}

function Section({ title, entries, emptyText, type, addingKey, onAdd }: SectionProps) {
  return (
    <Box component="section" sx={{ mb: 8 }}>
      <Typography
        component="h2"
        sx={{
          fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.2rem' },
          textTransform: 'uppercase', letterSpacing: '0.02em', color: C.ink, mb: 3,
        }}
      >
        <Box component="span" sx={{ color: C.red }}>{title}</Box>
      </Typography>

      {entries.length === 0 ? (
        <Typography sx={{ fontFamily: FONT_BODY, color: C.muted }}>{emptyText}</Typography>
      ) : (
        <Grid container spacing={3} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {entries.map((e) => (
            <Grid key={e.id} component="li" size={{ xs: 12, sm: 6, md: 4 }}>
              <EntryCard
                entry={e}
                type={type}
                adding={addingKey === `${type}-${e.id}`}
                busy={addingKey !== null}
                onAdd={onAdd}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default function Menu() {
  const { id } = useParams<{ id: string }>()
  const { menu, loading, error, retry } = useMenu(id)
  const { cart, addingKey, updatingId, notice, clearNotice, add, remove, changeQuantity } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  const handleAdd: AddHandler = (type, entry, quantity) => add(type, entry.id, entry.name, quantity)
  const itemCount = cartItemCount(cart)

  return (
    <Box component="main" sx={{ bgcolor: C.bg, minHeight: '100vh', py: { xs: 6, md: 10 }, pb: { xs: 14, md: 16 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 } }}>
        <Typography
          component={Link}
          to="/locations"
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
            <CircularProgress aria-label="Loading menu" sx={{ color: C.red }} />
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

        {!loading && !error && menu && (
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
              {menu.restaurantName}
            </Typography>

            <Section
              title="Gerichte"
              entries={menu.dishes}
              emptyText="Aktuell sind keine Gerichte verfügbar."
              type="DISH"
              addingKey={addingKey}
              onAdd={handleAdd}
            />
            <Section
              title="Menüs"
              entries={menu.menus}
              emptyText="Aktuell sind keine Menüs verfügbar."
              type="MENU"
              addingKey={addingKey}
              onAdd={handleAdd}
            />
          </>
        )}
      </Container>

      {/* Warenkorb-Zusammenfassung */}
      {cart && itemCount > 0 && (
        <Box
          role="status"
          sx={{
            position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 10,
            bgcolor: 'rgba(13,13,13,0.96)', backdropFilter: 'blur(14px)',
            borderTop: '1px solid rgba(232,0,13,0.35)', py: 2, px: { xs: 3, md: 4 },
          }}
        >
          <Container maxWidth="lg" disableGutters sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Button
              onClick={() => setCartOpen(true)}
              aria-label="Warenkorb ansehen"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: C.ink, textTransform: 'none', px: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
            >
              <CartIcon size={24} />
              <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, color: C.ink }}>
                {itemCount} Artikel
              </Typography>
            </Button>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.5rem', color: C.red }}>
              {formatPrice(cart.totalPrice)}
            </Typography>
          </Container>
        </Box>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updatingId={updatingId}
        onRemove={(item) => { void remove(item) }}
        onChangeQuantity={(item, quantity) => { void changeQuantity(item, quantity) }}
      />

      <Snackbar
        open={notice !== null}
        autoHideDuration={4000}
        onClose={(_, reason) => { if (reason !== 'clickaway') clearNotice() }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {/* Alert muss immer ein Kind sein, sonst warnt MUI - bei notice === null ist das Snackbar ohnehin zu */}
        <Alert onClose={clearNotice} severity={notice?.severity ?? 'success'} variant="filled" sx={{ fontFamily: FONT_BODY }}>
          {notice?.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
