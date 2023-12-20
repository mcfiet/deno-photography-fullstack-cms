- In der Request Methode cookies auslesen
  - `ctx.cookies = new CookieMap(ctx.request)`
  - `Array.from(ctx.cookies.entries())`

- Cookies setzen
  - `const count = ctx.cookies.get("count") ?? 0;`
  - `ctx.cookies.set("count", Number(count++));`

- Session
  - `ctx.state.flash = ctx.session.flash;`
  - `delete ctx.session.flash;`

input checkbox um booleans in objekt zu ändern aus der formdata

```javascript
user1 = {
  deleteImages: true,
  deleteAlbums: true,
  deleteProducts: true,
  addImages: true,
  addAlbums: true,
  addProduct: true,
};
```

start.sh
