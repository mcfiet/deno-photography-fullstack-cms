import { CookieMap } from "https://deno.land/std@0.208.0/http/unstable_cookie_map.ts";

export const createContext = (request, options) => ({
  request,
  url: new URL(request.url),
  response: {
    body: "",
    status: null,
    headers: new Headers(),
  },
  db: options.db,
  staticBase: options.staticBase,
  sessionStore: options.sessionStore,
  nunjucks: options.nunjucks,
  cookies: new CookieMap(request),
});
