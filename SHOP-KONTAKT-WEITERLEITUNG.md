# Anfrage im Kontakt statt im Shop

- **Shop (`shop.html`)**: `Zum T-Shirt anfragen` öffnet `kontakt.html?shop=tshirt`.
- **Jacke anfragen** öffnet `kontakt.html?shop=jacke` und wählt das Produkt vor.
- **Kontakt (`kontakt.html`) normal öffnen**: Das bisherige Kontaktformular erscheint wie zuvor; die Shop-Felder sind verborgen.
- **Kontakt mit Shop-Parameter**: Nur das Shop-Anfrageformular erscheint, mit Wunschprodukt, Größe, Menge, Versand/Abholung, Lieferadresse und Kontaktdaten.
- **Abholung**: Adressfelder werden verborgen und deaktiviert; **Versand**: vollständige Lieferadresse ist Pflicht.
- Der Versand erfolgt weiterhin über FormSubmit an die bereits hinterlegte E-Mail-Adresse. Vor Veröffentlichung ist die Verifizierung des Postfachs bei FormSubmit und ein Testversand erforderlich; ohne Aktivierung ist eine erfolgreiche Zustellung nicht sichergestellt.
- Das Formular ist eine unverbindliche Anfrage, kein Online-Checkout.
