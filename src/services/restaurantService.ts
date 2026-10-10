import { useCallback, useEffect, useState } from 'react'

export interface Location {
  postalCode: number
  streetName: string
  description: string | null
}

export interface Restaurant {
  id: number
  name: string
  location: Location | null
}

// Backend: GET /restaurant/getSortedBy?by=name&direction=asc
export const RESTAURANTS_URL = '/restaurant/getSortedBy?by=name&direction=asc'

export async function fetchRestaurants(signal?: AbortSignal): Promise<Restaurant[]> {
  const res = await fetch(RESTAURANTS_URL, { signal })
  if (!res.ok) {
    throw new Error(`Restaurants konnten nicht geladen werden (HTTP ${res.status})`)
  }
  return (await res.json()) as Restaurant[]
}

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetchRestaurants(controller.signal)
      .then((data) => {
        setRestaurants(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const isHttpError = err instanceof Error && err.message.includes('HTTP')
        setError(
          isHttpError
            ? 'Die Standorte konnten nicht geladen werden. Bitte versuche es erneut.'
            : 'Server nicht erreichbar. Bitte versuche es später.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  return { restaurants, loading, error, retry }
}
