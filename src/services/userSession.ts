const ID_KEY = 'redogo.userId'
const NAME_KEY = 'redogo.userName'

export const DEFAULT_USER_ID = 1

export function getUserId(): number {
  try {
    const raw = localStorage.getItem(ID_KEY)
    const id = raw ? Number(raw) : NaN
    return Number.isInteger(id) && id > 0 ? id : DEFAULT_USER_ID
  } catch {
    return DEFAULT_USER_ID
  }
}

export function setUserId(id: number): void {
  try {
    localStorage.setItem(ID_KEY, String(id))
  } catch {}
}

export function clearUserId(): void {
  try {
    localStorage.removeItem(ID_KEY)
  } catch {}
}

export function getUserName(): string | null {
  try {
    return localStorage.getItem(NAME_KEY)
  } catch {
    return null
  }
}

export function setUserName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name)
    window.dispatchEvent(new CustomEvent('redogo:auth'))
  } catch {}
}

export function clearUserName(): void {
  try {
    localStorage.removeItem(NAME_KEY)
    window.dispatchEvent(new CustomEvent('redogo:auth'))
  } catch {}
}
