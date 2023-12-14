import { CookieMap, mergeHeaders } from "https://deno.land/std/http/mod.ts";

export function getFromRequest(ctx) {
  ctx.cookies = new CookieMap(ctx.request);
  return ctx;
}
