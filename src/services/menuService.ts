import { useCallback, useEffect, useState } from 'react'

export interface MenuEntry {
  id: number
  name: string
  description: string | null
  price: number
  available: boolean
}

export interface Menu {
  restaurantId: number
  restaurantName: string
  dishes: MenuEntry[]
  menus: MenuEntry[]
}

export class HttpError extends Error {
  status: number

  constructor(status: number) {
    super(`Menu could not be loaded (HTTP ${status})`)
    this.status = status
  }
}

export const menuUrl = (restaurantId: string | number) =>
  `/restaurant/${encodeURIComponent(String(restaurantId))}/speisekarte`

export async function fetchMenu(restaurantId: string | number, signal?: AbortSignal): Promise<Menu> {
  const res = await fetch(menuUrl(restaurantId), { signal })
  if (!res.ok) {
    throw new HttpError(res.status)
  }
  const raw = await res.json()
  return {
    restaurantId: raw.restaurantId,
    restaurantName: raw.restaurantName,
    dishes: raw.gerichte ?? [],
    menus: raw.menues ?? [],
  }
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(price)

function toErrorMessage(err: unknown): { message: string; notFound: boolean } {
  if (err instanceof HttpError) {
    return err.status === 404 || err.status === 400
      ? { message: 'Dieses Restaurant wurde nicht gefunden.', notFound: true }
      : { message: 'Die Speisekarte konnte nicht geladen werden. Bitte versuche es erneut.', notFound: false }
  }
  return { message: 'Server nicht erreichbar. Bitte versuche es später.', notFound: false }
}

interface FetchResult {
  id: string
  menu: Menu | null
  error: { message: string; notFound: boolean } | null
}

export function useMenu(restaurantId: string | undefined) {
  const [result, setResult] = useState<FetchResult | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!restaurantId) return
    const controller = new AbortController()

    fetchMenu(restaurantId, controller.signal)
      .then((data) => setResult({ id: restaurantId, menu: data, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setResult({ id: restaurantId, menu: null, error: toErrorMessage(err) })
      })

    return () => controller.abort()
  }, [restaurantId, attempt])

  const retry = useCallback(() => {
    setResult(null)
    setAttempt((n) => n + 1)
  }, [])

  const current = result && result.id === restaurantId ? result : null
  const loading = !!restaurantId && current === null

  return {
    menu: current?.menu ?? null,
    loading,
    error: restaurantId ? (current?.error ?? null) : { message: 'Dieses Restaurant wurde nicht gefunden.', notFound: true },
    retry,
  }
}
