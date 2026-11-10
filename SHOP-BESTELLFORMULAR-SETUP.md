# Shop-Bestellanfrage – Inbetriebnahme

Stand: 10. November 2026

## Eingebaut

Die Seite `kontakt.html?shop=tshirt` enthält das responsive T-Shirt-Anfrageformular; `kontakt.html?shop=jacke` wählt Jacke vor. `shop.html` zeigt die Produkte und verlinkt auf die Kontaktseite. Ohne `shop`-Parameter bleibt das allgemeine Kontaktformular unverändert. Besucher wählen T-Shirt oder Jacke (unverbindlicher Wunsch), Wunschgröße, Anzahl, Versand oder Abholung, Name und E-Mail. Bei Versand sind Straße/Hausnummer, PLZ, Ort und Land Pflicht; bei Abholung werden diese Felder ausgeblendet und deaktiviert. Telefonnummer und Nachricht sind freiwillig. Es werden keine Zahlungsdaten abgefragt und kein Kaufvertrag durch Absenden geschlossen.

Die Formularaktion zeigt auf `https://formsubmit.co/buntbewegt@gmx.de`, die neue BuntBewegt-E-Mail-Adresse. Der bestehende Mitmachen-/Kontakt-Bereich bereitet hingegen lediglich eine Instagram-Nachricht vor und versendet **keine** automatische E-Mail. Der Shop ist deshalb eigenständig an einen Formular-Dienst angebunden.

## WICHTIG vor Veröffentlichung / E-Mail-Aktivierung

1. Faro muss den Versanddienst FormSubmit für ihre E-Mail-Adresse **einmalig bestätigen**. Dazu wird nach dem Hochladen der Website der erste Test über das Shopformular abgeschickt; FormSubmit sendet eine Bestätigungs-E-Mail an `buntbewegt@gmx.de`. Diesen Bestätigungslink öffnen. **Ohne diese Bestätigung können die Shop-Nachrichten nicht regulär zugestellt werden.** (Spam-Ordner ggf. prüfen.)
2. Anschließend eine zweite **Testanfrage mit Testdaten** durchführen und prüfen, ob sie im Postfach ankommt. Keine echten Kundendaten zum Testen verwenden.
3. Vor dem öffentlichen Einsatz die Datenschutz- und Vertragsanforderungen prüfen (Drittanbieter, mögliches Drittland, rechtliche Angaben im Impressum, ggf. DPA). Die Datenschutzhinweise der Seite wurden um die neue Formfunktion ergänzt, eine individuelle rechtliche Prüfung wird dadurch nicht ersetzt.
4. Preise, Versandkosten, Liefergebiete, Größenverfügbarkeit und Abholort müssen von BuntBewegt festgelegt bzw. im persönlichen Angebot mitgeteilt werden. Das Formular ist bewusst eine **unverbindliche Bestellanfrage**, kein bezahlter Checkout.
5. Eine serverseitige Bestätigung des Eingangs war ohne Zugang zum Postfach und zum produktiven Webhosting nicht möglich. `formsubmit.co` ist ein externer Dienst, dessen Verfügbarkeit nicht garantiert werden kann.

## Technisch

- `shop.html`: Produktbilder und Links auf das Anfrageformular
- `kontakt.html`: bedingt eingeblendetes Shopformular / Datenfelder / Versandoptionen
- `shop-order.js`: Umschaltung der Lieferanschrift, Wunschprodukt-Link
- `shop.css`: Layout und responsive Formgestaltung
- `datenschutz.html`: Datenschutzhinweise für den Formularversand

Der Versand wird als normaler HTML-POST durchgeführt (mit FormSubmit-Spam-Prüfung). Der Browser zeigt danach die Bestätigungs-/Antwortseite des Dienstes; die Webseite selbst behauptet keinen Versand-Erfolg, bevor der externe Dienst reagiert.
