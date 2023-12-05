import * as model from "./model.js";
import { CookieMap, mergeHeaders } from "https://deno.land/std/http/mod.ts";

let isLoggedIn = true;

export const get = async (ctx, site, status) => {
  // Wert setzen (Controller)
  ctx.cookies.set("test2", "id", {});
  // --
  ctx.response.body = await ctx.nunjucks.render(`${site}.html`, {
    isLoggedIn: isLoggedIn,
  });
  ctx.response.status = status;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
