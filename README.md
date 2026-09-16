# Redo Go – Frontend

Redo Go ist eine Bestell-App im Stil von René „Redo“ Dost, dem Gastronomen und Social-Media-Star hinter Redo XXL. Groß, laut, bunt und mit Portionen, die über den Tellerrand hängen.

Dieses Repository enthält die Weboberfläche für Kunden und für den Inhaber. Die Daten kommen vom [Redo Go Backend](../backend_redogo).

## Für Kunden

### Essen bestellen
Kunden stöbern durch die Speisekarte, filtern nach Kategorien und legen Gerichte in den Warenkorb. Bei jedem Gericht lassen sich Größe (Normal, XL, XXL), Extras und Menge wählen. Im Warenkorb entscheidet der Kunde, ob er abholt oder liefern lässt, und wählt ein Zeitfenster. Nach dem Absenden sieht er den Status seiner Bestellung.

### Vouchers einlösen
Im Warenkorb kann ein Voucher-Code eingegeben werden. Je nach Voucher sinkt der Preis um einen bestimmten Prozentsatz oder ein ganzes Menü ist gratis. Der Rabatt wird sofort in der Gesamtsumme angezeigt.

### Empfehlung der Woche
Jede Woche gibt es ein Gericht, das besonders hervorgehoben wird. Die Seite dazu ist voll im Redo-XXL-Stil gestaltet: riesige Schrift, grelle Farben, maximale Übertreibung. Empfehlungen gibt es grundsätzlich nur in XXL.

## Für den Inhaber

### Bestellungen einsehen
Der Inhaber sieht alle eingegangenen Bestellungen in einer Übersicht und kann nach bezahlt und unbezahlt filtern. Offene Bestellungen lassen sich als bezahlt markieren.

### Vouchers verwalten
Der Inhaber legt Vouchers an, bearbeitet oder deaktiviert sie. Für jeden Voucher gibt er einen Code und die Art der Vergünstigung an:

- prozentuelle Reduktion des Bestellpreises
- ein bestimmtes Menü gratis

### Empfehlung der Woche festlegen
Die Wochenempfehlung kann auf zwei Arten bestimmt werden. Entweder plant der Inhaber sie über einen Kalender im Voraus pro Kalenderwoche (KW1, KW2, …), oder er lässt sie per Zufall aus der Speisekarte auswählen, wenn es schnell gehen soll.

## Seiten

| Seite | Wer | Inhalt |
|---|---|---|
| Startseite | Kunde | Einstieg, Kategorien, Hinweis auf die Empfehlung der Woche |
| Speisekarte | Kunde | Alle Gerichte mit Filter und Suche |
| Empfehlung der Woche | Kunde | Das XXL-Gericht der aktuellen Woche |
| Warenkorb | Kunde | Bestellung abschließen, Voucher einlösen |
| Bestellstatus | Kunde | Fortschritt der eigenen Bestellung |
| Bestellungen | Inhaber | Übersicht, bezahlt oder unbezahlt |
| Vouchers | Inhaber | Vouchers anlegen und verwalten |
| Wochenempfehlungen | Inhaber | Kalender pro KW oder Zufallsauswahl |

## Technik

React 19, TypeScript, Vite und React Router. Der Warenkorb wird im Browser gespeichert, damit er nach einem Neuladen erhalten bleibt.

> Schulprojekt. Keine echten Bestellungen, keine offizielle Verbindung zu Redo XXL.