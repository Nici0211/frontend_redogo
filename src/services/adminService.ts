import { useCallback, useEffect, useState } from 'react'
import { getUserId } from './userSession'
import type { MenuEntry } from './menuService'
import type { Restaurant } from './restaurantService'

/** US09: Formularwerte beim Anlegen eines Gerichts (Preis als Text, damit "9,50" eingegeben werden kann). */
export interface DishFormState {
  name: string
  description: string
  price: string
  available: boolean
}

export interface DishFormErrors {
  name?: string
  description?: string
  price?: string
}

export const EMPTY_DISH_FORM: DishFormState = { name: '', description: '', price: '', available: true }

export const NAME_MAX = 100
export const DESCRIPTION_MAX = 500

/** "9,50" und "9.50" werden akzeptiert; liefert null bei ungültiger Eingabe. */
export function parsePrice(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.')
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(normalized)) return null
  const value = Number(normalized)
  return value > 0 ? value : null
}

export function validateDishForm(form: DishFormState): DishFormErrors {
  const errors: DishFormErrors = {}
  if (!form.name.trim()) errors.name = 'Pflichtfeld'
  else if (form.name.trim().length > NAME_MAX) errors.name = `Höchstens ${NAME_MAX} Zeichen`
  if (form.description.length > DESCRIPTION_MAX) errors.description = `Höchstens ${DESCRIPTION_MAX} Zeichen`
  if (!form.price.trim()) errors.price = 'Pflichtfeld'
  else if (parsePrice(form.price) === null) errors.price = 'Gültigen Preis eingeben, z. B. 9,50'
  return errors
}

const adminBase = (adminId: number) => `/api/admin/${adminId}`

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json()
    if (typeof body?.message === 'string' && body.message) return body.message
  } catch {
    // Antwort war kein JSON - Standardmeldung verwenden
  }
  return fallback
}

export async function fetchOwnRestaurants(adminId: number, signal?: AbortSignal): Promise<Restaurant[]> {
  const res = await fetch(`${adminBase(adminId)}/restaurants`, { signal })
  if (res.status === 403) throw new Error('Kein Zugriff: Dieser Bereich ist nur für Restaurantinhaber.')
  if (!res.ok) throw new Error(await readError(res, 'Deine Restaurants konnten nicht geladen werden.'))
  return (await res.json()) as Restaurant[]
}

/** Ein Eintrag der Speisekarte ist entweder ein einzelnes Gericht oder ein Menü (Kombi-Angebot). */
export type EntryKind = 'dish' | 'menu'

const kindPath = (kind: EntryKind) => (kind === 'dish' ? 'dishes' : 'menus')

export async function createDish(adminId: number, restaurantId: number, form: DishFormState, kind: EntryKind = 'dish'): Promise<MenuEntry> {
  const price = parsePrice(form.price)
  if (price === null) throw new Error('Ungültiger Preis')

  const res = await fetch(`${adminBase(adminId)}/restaurants/${restaurantId}/${kindPath(kind)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name.trim(),
      description: form.description.trim() || null,
      price,
      available: form.available,
    }),
  })
  if (!res.ok) throw new Error(await readError(res, kind === 'dish' ? 'Das Gericht konnte nicht gespeichert werden.' : 'Das Menü konnte nicht gespeichert werden.'))
  return (await res.json()) as MenuEntry
}

/** US11: Löscht ein Gericht oder Menü von der Speisekarte (Antwort 204 ohne Inhalt). */
export async function deleteDish(adminId: number, restaurantId: number, id: number, kind: EntryKind = 'dish'): Promise<void> {
  const res = await fetch(`${adminBase(adminId)}/restaurants/${restaurantId}/${kindPath(kind)}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await readError(res, kind === 'dish' ? 'Das Gericht konnte nicht gelöscht werden.' : 'Das Menü konnte nicht gelöscht werden.'))
}

/** Lädt die Restaurants des angemeldeten Admins. */
export function useOwnRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchOwnRestaurants(getUserId(), controller.signal)
      .then((data) => { setRestaurants(data); setError(null) })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof TypeError ? 'Server nicht erreichbar. Bitte versuche es später.' : (err as Error).message)
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  return { restaurants, loading, error, retry }
}
