import { useCallback, useEffect, useState } from 'react'

export interface SpeisekarteEintrag {
  id: number
  name: string
  description: string | null
  price: number
}

export interface Speisekarte {
  restaurantId: number
  restaurantName: string
  gerichte: SpeisekarteEintrag[]
  menues: SpeisekarteEintrag[]
}

export class HttpError extends Error {
  status: number

  constructor(status: number) {
    super(`Speisekarte konnte nicht geladen werden (HTTP ${status})`)
    this.status = status
  }
}

// Backend: GET /restaurant/{id}/speisekarte
export const speisekarteUrl = (restaurantId: string | number) =>
  `/restaurant/${encodeURIComponent(String(restaurantId))}/speisekarte`

export async function fetchSpeisekarte(restaurantId: string | number, signal?: AbortSignal): Promise<Speisekarte> {
  const res = await fetch(speisekarteUrl(restaurantId), { signal })
  if (!res.ok) {
    throw new HttpError(res.status)
  }
  return (await res.json()) as Speisekarte
}

export const formatPreis = (price: number) =>
  new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(price)

function toErrorMessage(err: unknown): { message: string; notFound: boolean } {
  if (err instanceof HttpError) {
    return err.status === 404 || err.status === 400
      ? { message: 'Dieses Restaurant wurde nicht gefunden.', notFound: true }
      : { message: 'Die Speisekarte konnte nicht geladen werden. Bitte versuche es erneut.', notFound: false }
  }
  return { message: 'Server nicht erreichbar. Bitte versuche es später.', notFound: false }
}

interface Result {
  id: string
  speisekarte: Speisekarte | null
  error: { message: string; notFound: boolean } | null
}

export function useSpeisekarte(restaurantId: string | undefined) {
  const [result, setResult] = useState<Result | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!restaurantId) return
    const controller = new AbortController()

    fetchSpeisekarte(restaurantId, controller.signal)
      .then((data) => setResult({ id: restaurantId, speisekarte: data, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setResult({ id: restaurantId, speisekarte: null, error: toErrorMessage(err) })
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
    speisekarte: current?.speisekarte ?? null,
    loading,
    error: restaurantId ? (current?.error ?? null) : { message: 'Dieses Restaurant wurde nicht gefunden.', notFound: true },
    retry,
  }
}
