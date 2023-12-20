import { CookieMap, mergeHeaders } from "https://deno.land/std/http/mod.ts";

export function getCookies(ctx) {
  ctx.cookies = new CookieMap(ctx.request);
  return ctx;
}

export const setCookies = (ctx) => {
  ctx.response.headers = mergeHeaders(ctx.response.headers, ctx.cookies);
  return ctx;
};
