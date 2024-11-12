# deno-photography-shop-cms

## Server starten

Um den Server zu starten haben wir den Befehl:

```
deno run --allow-net --allow-read --allow-write --allow-env --watch server.js
```

verwendet.

## app.js und /framework/app.js

Falls auf dem Server etwas nicht klappen sollte, was auf die `/framework/app.js`
zurückzuführen ist, kann auch gerne die `handleRequest()` aus der `app.js` der
`serve()`-Methode übergeben werden. Deshalb liegt diese noch in `/src`.

## Einloggen

Um sich mit dem Admin-Account einzuloggen benötigt man folgende Daten:

Benutzername: admin@test.de

Passwort: Test123#
<br><br>

Alle anderen Accounts

- content@manager.de
- user@manager.de
- editor@manager.de
- client@one.de
- client@two.de
- client@three.de

haben alle das gleiche Passwort, wie der Admin.

## Vorhandene Daten

Es gibt schon eingespielte Daten, damit die Seite nicht so leer wirkt und das
Prinzip klar wird.

### bcrypt.js

Falls irgendwelche Daten oder Passwörter doch nicht vorhanden sein sollen,
lassen sich gehashte Passwörter auch mit `bcrypt.js` erstellen
