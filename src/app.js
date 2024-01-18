import * as sqlite from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { createContext } from "./framework/context.js";
import { createApp } from "./framework/app.js";
import * as controller from "./controller/controller.js";
import { getUser } from "./middleware/user.js";
import { getFlash } from "./middleware/flash.js";
import { router } from "./router.js";
import { serveStaticFile } from "./middleware/serveStaticFiles.js";
import nunjucks from "npm:nunjucks@3.2.4";
import {
  createSessionStore,
  getSession,
  setSession,
} from "./middleware/session.js";
import { getCookies, setCookies } from "./middleware/cookies.js";
import { serve } from "https://deno.land/std@0.156.0/http/server.ts";

const db = new sqlite.DB("./data/data.db");

nunjucks.configure("templates", { autoescape: true });

const middleware = [
  getCookies,
  getSession,
  getFlash,
  getUser,
  router.routes(),
  serveStaticFile,
  setSession,
  setCookies,
];

const sessionStore = createSessionStore();

// export const app = createApp();

// app.context.db = db;
// app.context.nunjucks = nunjucks;
// app.context.session = {};
// app.context.sessionStore = createSessionStore();
// app.context.keys = "PN9Pf3Wjb4FbuVZ1GbeFVvw2cPO2FTR4i70PpX+";
// app.useMiddelware(middleware);

/**
 * Handle one HTTP request.
 * @param {Request} request
 * @returns {Response}
 */
export const handleRequest = async (request) => {
  let ctx = createContext(request, {
    db,
    staticBase: "public",
    nunjucks,
    sessionStore,
  });

  try {
    ctx = await pipe(...middleware)(ctx);
  } catch (error) {
    ctx.error = error;
    console.log(error);
    ctx.response.status = ctx.response.status ?? 500;
  }

  if (ctx.redirect) {
    return ctx.redirect;
  }

  ctx.response.status = ctx.response.status ?? 404;

  if (!ctx.response.body && ctx.response.status == 404) {
    ctx = await controller.error404(ctx);
  }
  return new Response(ctx.response.body, {
    status: ctx.response.status,
    headers: ctx.response.headers,
  });
};

const pipe =
  (...funcs) =>
  (arg) =>
    funcs.reduce(async (state, func) => func(await state), arg);

//await serve(handleRequest, { port: 8080 });
