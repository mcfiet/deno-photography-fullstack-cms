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
  state: {},
  async render(site, options) {
    let cartAmount;
    if (this.session.cart) {
      cartAmount = this.session.cart.images.length;
    }
    return await this.nunjucks.render(site, {
      cartAmount,
      ...options,
      ...this.state,
    });
  },
  setResponse(site, status, contentType) {
    this.response.body = site;
    this.response.status = status;
    this.response.headers.set("content-type", contentType);
    return this;
  },
});
