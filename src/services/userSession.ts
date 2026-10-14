// Merkt sich die ID des Benutzers im Browser, damit der Warenkorb (/api/users/{id}/cart)
// weiß, wem er gehört. Es gibt noch keinen Login - die ID wird nach der Registrierung gesetzt.
const KEY = 'redogo.userId'

// Solange es keinen Login gibt, startet der Warenkorb mit einem Seed-Benutzer aus data.sql:
// 1 = Anna Muster (erster Eintrag in data.sql). Bei Bedarf hier z. B. auf 2 (Max) oder 3 (Lisa) ändern.
export const DEFAULT_USER_ID = 1

export function getUserId(): number {
  try {
    const raw = localStorage.getItem(KEY)
    const id = raw ? Number(raw) : NaN
    return Number.isInteger(id) && id > 0 ? id : DEFAULT_USER_ID
  } catch {
    return DEFAULT_USER_ID
  }
}

export function setUserId(id: number): void {
  try {
    localStorage.setItem(KEY, String(id))
  } catch {
    // localStorage nicht verfügbar (z. B. privater Modus) - dann bleibt man eben "abgemeldet"
  }
}

export function clearUserId(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // nichts zu tun
  }
}
