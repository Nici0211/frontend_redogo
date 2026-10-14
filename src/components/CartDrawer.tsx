import { Box, Button, Drawer, IconButton, Typography } from '@mui/material'
import { formatPrice } from '../services/menuService'
import { MAX_QUANTITY } from '../services/cartService'
import type { Cart, CartItem } from '../services/cartService'

const C = {
  bg: '#18181b',
  surface: '#27272a',
  surface2: '#3f3f46',
  border: 'rgba(255,255,255,0.08)',
  red: '#e8000d',
  ink: '#f4f4f5',
  muted: '#a1a1aa',
}
const FONT_DISPLAY = "'Barlow Condensed', sans-serif"
const FONT_BODY = "'Nunito', sans-serif"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  cart: Cart | null
  updatingId: number | null // Position, die gerade geändert/entfernt wird
  onRemove: (item: CartItem) => void
  onChangeQuantity: (item: CartItem, quantity: number) => void
}

/** US7: Warenkorb ansehen, Menge ändern und Artikel entfernen. */
export default function CartDrawer({ open, onClose, cart, updatingId, onRemove, onChangeQuantity }: CartDrawerProps) {
  const items = cart?.items ?? []
  const busy = updatingId !== null

  const stepperSx = {
    color: C.ink, bgcolor: C.surface2, borderRadius: '8px', width: 32, height: 32,
    fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.2rem', lineHeight: 1,
    '&:hover': { bgcolor: '#52525b' },
    '&.Mui-disabled': { color: C.muted, opacity: 0.5 },
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { bgcolor: C.bg, width: { xs: '100%', sm: 420 }, p: 3 } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          component="h2"
          sx={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '2rem', textTransform: 'uppercase', color: C.ink }}
        >
          Warenkorb
        </Typography>
        <IconButton aria-label="Warenkorb schließen" onClick={onClose} sx={{ color: C.muted }}>
          ✕
        </IconButton>
      </Box>

      {items.length === 0 ? (
        <Typography sx={{ fontFamily: FONT_BODY, color: C.muted }}>Dein Warenkorb ist leer.</Typography>
      ) : (
        <>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto' }}>
            {items.map((item) => {
              const updating = updatingId === item.id
              return (
                <Box
                  key={item.id}
                  component="li"
                  sx={{
                    bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', p: 2,
                    opacity: updating ? 0.6 : 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, color: C.ink }}>{item.name}</Typography>
                    <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.2rem', color: C.red, whiteSpace: 'nowrap' }}>
                      {formatPrice(item.lineTotal)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                      aria-label={`Menge von ${item.name} verringern`}
                      disabled={busy}
                      onClick={() => onChangeQuantity(item, item.quantity - 1)}
                      sx={stepperSx}
                    >
                      −
                    </IconButton>
                    <Typography
                      aria-live="polite"
                      sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.1rem', color: C.ink, minWidth: 28, textAlign: 'center' }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      aria-label={`Menge von ${item.name} erhöhen`}
                      disabled={busy || item.quantity >= MAX_QUANTITY}
                      onClick={() => onChangeQuantity(item, item.quantity + 1)}
                      sx={stepperSx}
                    >
                      +
                    </IconButton>
                    <Button
                      aria-label={`${item.name} aus dem Warenkorb entfernen`}
                      disabled={busy}
                      onClick={() => onRemove(item)}
                      sx={{
                        ml: 'auto', color: C.muted, fontFamily: FONT_BODY, fontWeight: 700, textTransform: 'none',
                        '&:hover': { color: C.red, bgcolor: 'transparent' },
                      }}
                    >
                      Entfernen
                    </Button>
                  </Box>
                </Box>
              )
            })}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', pt: 3, mt: 3, borderTop: `1px solid ${C.border}` }}>
            <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, color: C.muted }}>Gesamtpreis</Typography>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '1.8rem', color: C.red }}>
              {formatPrice(cart?.totalPrice ?? 0)}
            </Typography>
          </Box>
        </>
      )}
    </Drawer>
  )
}
