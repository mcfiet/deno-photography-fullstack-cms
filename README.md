# deno-photography-shop-cms

A photography website built with Deno, featuring server-side rendered Twig templating. It includes a custom middleware framework similar to Oak, with app, controller, and router management. Key features include protected routes, a role-based CMS with user authentication, shopping cart logic, and SQLite database integration for data storage.
## Server starten

Um den Server zu starten haben wir den Befehl:

```
deno run --allow-net --allow-read --allow-write --allow-env --watch server.js
```

verwendet.

## Einloggen

Um sich mit dem Admin-Account einzuloggen benötigt man folgende Daten:

Benutzername: admin@test.de

Passwort: Test123#

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
