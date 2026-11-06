# News, Bilder und Eventmaterial pflegen

## Seiten und Inhalte

- `news-events.html`: gestaltete Übersicht mit dem nächsten KTV-Adler-Heimspiel am 22. November 2026, zwei KTV-Adler-Terminen, einer Bildvorschau und sechs weiteren Geschichten.
- `event-*.html`: sieben vollständige Artikel aus dem bereitgestellten Dokument. Die Zwischenüberschriften, Originaltexte und Inhaltsverzeichnisse bleiben erhalten.
- `bilder-material.html`: vollständige Sammlung der 13 bereitgestellten Bilder. Ohne JavaScript sind alle Bilder sichtbar und über die Bildlinks erreichbar. Mit JavaScript lassen sich die drei Themenbereiche filtern.
- `event-kieler-lichtermeer-2026.html#material`: alle neun Motive und Laternenanleitungen zum Lichtermeer.
- `angebote.html#event-material`: alle vier Event-Flyer, mit der breiten Stationsübersicht und drei Hochformatflyern.
- `index.html`: Vorschau auf das nächste KTV-Adler-Heimspiel mit Kinderschminken und Glitzer-Tattoos, einem Rückblick und Zugang zur vollständigen Sammlung.
- Die KTV-Adler-Vorschau nutzt wieder das ursprüngliche `j-feature`-Layout mit `colorful-event.css`, `homepage-poster-full.css` und `news-events-cards.css`: helle Fläche, petrolfarbene Überschrift, korallfarbene Hervorhebung und gelber Button. Das Plakat wird ohne Beschnitt angezeigt; eine dezente schwebende Bewegung wird nur dann abgespielt, wenn im System reduzierte Animation nicht aktiviert ist.
- `images/events/ktv-adler-heimspiele-2026-2027.jpg`: unverändertes Veranstaltungsplakat. Es wird vollständig angezeigt und öffnet sich per Klick im vorhandenen Bildbetrachter; keine Texte oder Datumsfelder liegen über dem Motiv.

## Die 13 Bilder

Lichterwelt (3): Lichterzauber, Laternenwerkstatt, Laternenauswahl.

Bastelanleitungen (6): Papierlaterne, Fliegenpilz, PET-Flasche, Einmachglas, Papier-Häuschen, Milchkarton.

Event-Flyer (4): Stationsübersicht im Querformat, Stationen im Hochformat, Stationspakete, besondere Extras.

Alle PNG-Dateien in `downloads/events/` sind unveränderte Originale. Die Dateien in `images/events/` sind optimierte WebP-Versionen und Vorschauen. Bilder werden vollständig dargestellt, ohne Bildteile abzuschneiden. Originale und Anleitungen wurden nicht inhaltlich retuschiert.

## Gestaltung und Interaktion

- `events.css`: Layout für die neuen Seiten, Artikel, Materialien und Startseitenvorschauen. Die Klassen beginnen mit `j-`.
- `events.js`: Galerie-Filter sowie Dialog mit Bildnavigation, Leseansicht, Original-Link und Download. In der Leseansicht wird das Bild in Originalbreite angezeigt und lässt sich horizontal und vertikal scrollen. Escape schließt den Dialog und der Fokus kehrt zum auslösenden Bildlink zurück.
- `events-nav.css`: Platz für den zusätzlichen Eintrag „News & Events“ im vorhandenen Menü. Das bestehende mobile Menü bleibt erhalten.

## Inhalte aktualisieren

1. Artikel in der zugehörigen `event-*.html` bearbeiten. Titel, Meta-Beschreibung, Einführung, Datum und Inhaltsnavigation mitführen.
2. Die Kurzfassung in `news-events.html` aktualisieren. Die Sammlung bleibt in `bilder-material.html`.
3. Die KTV-Adler-Vorschau in `index.html` (zwischen `NEWS-BEGIN` und `NEWS-END`) und `news-events.html` synchron halten. Beim Wechsel zur nächsten Veranstaltung Datum, Text, Bildmotiv, Alt-Text und Links mitführen.
4. Beim Ersetzen eines Bildes alle Vorkommen sowie `src`, `srcset`, `width`, `height`, Alternativtext, Originalpfad und `data-preview` aktualisieren.
5. `data-event-image` öffnet die Großansicht; `data-gallery` ordnet Vorschaugruppen zu. `data-material-group` bezeichnet die Filterbereiche `lichterwelt`, `anleitungen` und `flyer`.

Termine stammen aus dem bereitgestellten Artikel und sind manuell gepflegt: 1. November 2026 von 13–18 Uhr sowie KTV Adler am 22. November 2026 und 7. Februar 2027. Nach dem Ereignis Ankündigungen bei Bedarf in Rückblicke ändern. Das bereitgestellte KTV-Adler-Plakat bestätigt beide Heimspieltermine jeweils um 15:00 Uhr in der Hein-Dahlinger-Halle, Geschwister-Scholl-Straße 9, 24143 Kiel. Diese Angaben sind in Vorschau, Kalender und Artikeldetails übernommen. Keine weiteren Uhrzeiten oder Orte ergänzen, die noch nicht bestätigt sind.

## Übertragen und prüfen

Den kompletten Inhalt dieses Ordners einschließlich aller Unterordner auf die statische Hosting-Umgebung übertragen. Kein Build-Schritt und keine zusätzlichen Bibliotheken erforderlich.

Auf Desktop und Mobilgerät prüfen: News-Vorschau, alle 13 Bilder, Filter, Leseansicht, Bildwechsel, Escape, Downloads, Inhaltslinks und Hauptnavigation. Bei Änderungen die Versionskennungen der CSS- und JavaScript-Dateien erhöhen.

Die lokalen Referenzen, Bilddateien und Vollständigkeit der Artikel wurden geprüft. Die verwaltete Browser-Vorschau war in dieser Sitzung nicht verfügbar; die tatsächliche Darstellung und Interaktion im Browser bleiben daher zu prüfen.

Unter den Bildern werden keine Downloadzeile und keine Dateigrößen mehr angezeigt. Der Download in der geöffneten Großansicht bleibt verfügbar.

## Aktualisierung vom 6. November 2026

Der Event-Poster-Bereich auf Startseite und News-&-Events-Seite besitzt eine
dezente Bewegung in `event-image-motion.css`. Das Plakat bleibt anklickbar
und öffnet sich wie zuvor vollständig im vorhandenen Bildbetrachter.
Bei `prefers-reduced-motion: reduce` ist die Animation abgeschaltet.
