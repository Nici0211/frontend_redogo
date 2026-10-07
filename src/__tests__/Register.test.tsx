import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Register from '../pages/Register'

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
}

// ─── Äquivalenzklassen & Grenzwertanalyse ────────────────────────────────────
//
// Vorname / Nachname  : leer → Pflichtfeld | Leerzeichen-only → Pflichtfeld | gültig → kein Fehler
// E-Mail              : leer → Pflichtfeld | kein @/Punkt → ungültig | gültig → kein Fehler
// Passwort            : leer → Pflichtfeld | 7 Zeichen (GW) → zu kurz | 8 Zeichen (GW) → gültig
// Passwort wiederholen: leer → Pflichtfeld | abweichend → stimmen nicht überein | gleich → gültig
// Erfolg              : alle Felder gültig → Erfolgsmeldung mit Vorname

describe('US16 – Registrierungsformular (Black-Box)', () => {
  // ─── Leeres Formular ───────────────────────────────────────────────────────

  it('zeigt alle Pflichtfeld-Fehler beim leeren Absenden', async () => {
    renderRegister()
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))

    expect(screen.getAllByText('Pflichtfeld')).toHaveLength(5)
  })

  // ─── Vorname ───────────────────────────────────────────────────────────────

  it('Vorname leer → Fehler "Pflichtfeld"', async () => {
    renderRegister()
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/vorname/i).closest('.MuiFormControl-root'))
      .toHaveTextContent('Pflichtfeld')
  })

  it('Vorname nur Leerzeichen → Fehler "Pflichtfeld"', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/vorname/i), '   ')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/vorname/i).closest('.MuiFormControl-root'))
      .toHaveTextContent('Pflichtfeld')
  })

  it('Vorname gültig → kein Fehler in diesem Feld', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/vorname/i), 'Max')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/vorname/i).closest('.MuiFormControl-root'))
      .not.toHaveTextContent('Pflichtfeld')
  })

  // ─── Nachname ──────────────────────────────────────────────────────────────

  it('Nachname leer → Fehler "Pflichtfeld"', async () => {
    renderRegister()
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/nachname/i).closest('.MuiFormControl-root'))
      .toHaveTextContent('Pflichtfeld')
  })

  it('Nachname nur Leerzeichen → Fehler "Pflichtfeld"', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/nachname/i), '   ')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/nachname/i).closest('.MuiFormControl-root'))
      .toHaveTextContent('Pflichtfeld')
  })

  // ─── E-Mail ────────────────────────────────────────────────────────────────

  it('E-Mail leer → Fehler "Pflichtfeld"', async () => {
    renderRegister()
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/e-mail/i).closest('.MuiFormControl-root'))
      .toHaveTextContent('Pflichtfeld')
  })

  it('E-Mail ohne @ → Fehler "Ungültige E-Mail-Adresse"', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'keineat-zeichen.de')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/e-mail/i).closest('.MuiFormControl-root'))
      .toHaveTextContent('Ungültige E-Mail-Adresse')
  })

  it('E-Mail ohne Domain → Fehler "Ungültige E-Mail-Adresse"', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'user@')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/e-mail/i).closest('.MuiFormControl-root'))
      .toHaveTextContent('Ungültige E-Mail-Adresse')
  })

  it('E-Mail gültig → kein Fehler', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'max@beispiel.de')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/e-mail/i).closest('.MuiFormControl-root'))
      .not.toHaveTextContent('Ungültige E-Mail-Adresse')
  })

  // ─── Passwort – Grenzwerte ─────────────────────────────────────────────────

  it('Passwort leer → Fehler "Pflichtfeld"', async () => {
    renderRegister()
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getAllByText('Pflichtfeld').length).toBeGreaterThanOrEqual(1)
  })

  it('Passwort 7 Zeichen (Grenzwert unter) → Fehler "Mindestens 8 Zeichen"', async () => {
    renderRegister()
    await userEvent.type(screen.getAllByLabelText(/passwort/i)[0], '1234567')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getAllByLabelText(/passwort/i)[0].closest('.MuiFormControl-root'))
      .toHaveTextContent('Mindestens 8 Zeichen')
  })

  it('Passwort 8 Zeichen (Grenzwert) → kein Fehler auf dem Feld', async () => {
    renderRegister()
    await userEvent.type(screen.getAllByLabelText(/passwort/i)[0], '12345678')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getAllByLabelText(/passwort/i)[0]).not.toHaveAttribute('aria-invalid', 'true')
  })

  // ─── Passwort wiederholen ──────────────────────────────────────────────────

  it('Passwörter unterschiedlich → Fehler "Passwörter stimmen nicht überein"', async () => {
    renderRegister()
    await userEvent.type(screen.getAllByLabelText(/passwort/i)[0], 'Abcd1234')
    await userEvent.type(screen.getByLabelText(/passwort wiederholen/i), 'Abcd9999')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/passwort wiederholen/i).closest('.MuiFormControl-root'))
      .toHaveTextContent('Passwörter stimmen nicht überein')
  })

  it('Passwörter gleich → kein Fehler', async () => {
    renderRegister()
    await userEvent.type(screen.getAllByLabelText(/passwort/i)[0], 'Abcd1234')
    await userEvent.type(screen.getByLabelText(/passwort wiederholen/i), 'Abcd1234')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/passwort wiederholen/i).closest('.MuiFormControl-root'))
      .not.toHaveTextContent('stimmen nicht überein')
  })

  // ─── Fehler-Clearing beim Tippen ──────────────────────────────────────────

  it('Fehler verschwindet sobald Vorname eingegeben wird', async () => {
    renderRegister()
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))
    expect(screen.getByLabelText(/vorname/i).closest('.MuiFormControl-root'))
      .toHaveTextContent('Pflichtfeld')

    await userEvent.type(screen.getByLabelText(/vorname/i), 'M')
    expect(screen.getByLabelText(/vorname/i).closest('.MuiFormControl-root'))
      .not.toHaveTextContent('Pflichtfeld')
  })

  // ─── Erfolg ────────────────────────────────────────────────────────────────

  it('alle Felder gültig → Erfolgsscreen mit Vorname', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/vorname/i), 'Anna')
    await userEvent.type(screen.getByLabelText(/nachname/i), 'Muster')
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'anna@muster.at')
    await userEvent.type(screen.getAllByLabelText(/passwort/i)[0], 'Sicher123')
    await userEvent.type(screen.getByLabelText(/passwort wiederholen/i), 'Sicher123')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))

    expect(screen.getByText(/willkommen bei redogo, anna/i)).toBeInTheDocument()
    expect(screen.getByText(/erfolgreich!/i)).toBeInTheDocument()
  })

  it('Erfolgsscreen zeigt "Zur Startseite" Link', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/vorname/i), 'Test')
    await userEvent.type(screen.getByLabelText(/nachname/i), 'User')
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'test@test.de')
    await userEvent.type(screen.getAllByLabelText(/passwort/i)[0], 'Passwort1')
    await userEvent.type(screen.getByLabelText(/passwort wiederholen/i), 'Passwort1')
    await userEvent.click(screen.getByRole('button', { name: /registrieren/i }))

    expect(screen.getByRole('link', { name: /zur startseite/i })).toBeInTheDocument()
  })
})
