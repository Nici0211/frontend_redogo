import { useCallback, useEffect, useState } from 'react'
import { getUserId } from './userSession'

export type CartItemType = 'DISH' | 'MENU'

export interface CartItem {
  id: number
  type: CartItemType
  itemId: number
  name: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface Cart {
  id: number | null
  userId: number
  items: CartItem[]
  totalPrice: number
}

export interface CartNotice {
  severity: 'success' | 'error'
  message: string
}

/** Entspricht MAX_QUANTITY_PER_ITEM im ShoppingCartService (Backend). */
export const MAX_QUANTITY = 99

// Backend: GET/POST /api/users/{userId}/cart (POST an /items)
const cartUrl = (userId: number) => `/api/users/${encodeURIComponent(String(userId))}/cart`

class CartApiError extends Error {}

// Das Backend liefert Fehler als {"status": 409, "message": "..."} - die Meldung zeigen wir dem Kunden direkt.
async function toApiError(res: Response): Promise<CartApiError> {
  try {
    const body = (await res.json()) as { message?: string }
    if (body.message) return new CartApiError(body.message)
  } catch {
    // kein JSON-Body - weiter mit Standardtext
  }
  return new CartApiError(
    res.status === 404
      ? 'Der Artikel oder Benutzer wurde nicht gefunden.'
      : 'Der Warenkorb konnte nicht aktualisiert werden. Bitte versuche es erneut.',
  )
}

export async function fetchCart(userId: number, signal?: AbortSignal): Promise<Cart> {
  const res = await fetch(cartUrl(userId), { signal })
  if (!res.ok) throw await toApiError(res)
  return (await res.json()) as Cart
}

export async function addToCart(
  userId: number,
  type: CartItemType,
  itemId: number,
  quantity: number,
): Promise<Cart> {
  const res = await fetch(`${cartUrl(userId)}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, itemId, quantity }),
  })
  if (!res.ok) throw await toApiError(res)
  return (await res.json()) as Cart
}

export const cartItemCount = (cart: Cart | null) =>
  cart ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0

export function useCart() {
  const userId = getUserId()
  const [cart, setCart] = useState<Cart | null>(null)
  const [addingKey, setAddingKey] = useState<string | null>(null)
  const [notice, setNotice] = useState<CartNotice | null>(null)

  // bestehenden Warenkorb laden, damit die Anzeige auch nach einem Reload stimmt
  useEffect(() => {
    if (userId === null) return
    const controller = new AbortController()
    fetchCart(userId, controller.signal)
      .then(setCart)
      .catch(() => {
        // Ladefehler sind hier nicht kritisch - beim Hinzufügen kommt der Warenkorb ohnehin zurück
      })
    return () => controller.abort()
  }, [userId])

  const add = useCallback(
    async (type: CartItemType, itemId: number, name: string, quantity: number): Promise<boolean> => {
      if (userId === null) {
        setNotice({ severity: 'error', message: 'Bitte registriere dich zuerst, um Artikel in den Warenkorb zu legen.' })
        return false
      }
      setAddingKey(`${type}-${itemId}`)
      try {
        const updated = await addToCart(userId, type, itemId, quantity)
        setCart(updated)
        setNotice({ severity: 'success', message: `${quantity}× ${name} wurde zum Warenkorb hinzugefügt.` })
        return true
      } catch (err) {
        setNotice({
          severity: 'error',
          message: err instanceof CartApiError ? err.message : 'Server nicht erreichbar. Bitte versuche es später.',
        })
        return false
      } finally {
        setAddingKey(null)
      }
    },
    [userId],
  )

  const clearNotice = useCallback(() => setNotice(null), [])

  return { loggedIn: userId !== null, cart, addingKey, notice, clearNotice, add }
}
