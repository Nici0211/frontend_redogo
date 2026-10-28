const ID_KEY = 'redogo.userId'
const NAME_KEY = 'redogo.userName'
const ROLE_KEY = 'redogo.userRole'

/** US09: USER = normaler Kunde, ADMIN = Restaurantinhaber. */
export type UserRole = 'USER' | 'ADMIN'

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

export function getUserRole(): UserRole {
  try {
    return localStorage.getItem(ROLE_KEY) === 'ADMIN' ? 'ADMIN' : 'USER'
  } catch {
    return 'USER'
  }
}

/** Vor setUserName aufrufen - setUserName löst das 'redogo:auth'-Event aus, auf das die Navbar hört. */
export function setUserRole(role: UserRole): void {
  try {
    localStorage.setItem(ROLE_KEY, role)
  } catch { /* localStorage nicht verfügbar */ }
}

export function clearUserRole(): void {
  try {
    localStorage.removeItem(ROLE_KEY)
  } catch { /* localStorage nicht verfügbar */ }
}

export function isAdmin(): boolean {
  return getUserRole() === 'ADMIN'
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
