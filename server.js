import * as sqlite from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { createApp } from "./src/framework/app.js";
import { serve } from "https://deno.land/std@0.156.0/http/server.ts";
import { getUser } from "./src/middleware/user.js";
import { getFlash } from "./src/middleware/flash.js";
import { router } from "./src/router.js";
import { serveStaticFile } from "./src/middleware/serveStaticFiles.js";
import nunjucks from "npm:nunjucks@3.2.4";
import {
  createSessionStore,
  getSession,
  setSession,
} from "./src/middleware/session.js";
import { getCookies, setCookies } from "./src/middleware/cookies.js";

const port = 8080;
const db = new sqlite.DB("./data/data.db");

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

nunjucks.configure("templates", { autoescape: true });

export const app = createApp();

app.context.db = db;
app.context.staticBase = "public";
app.context.nunjucks = nunjucks;
app.context.session = {};
app.context.sessionStore = createSessionStore();
app.useMiddelware(middleware, app.context);

await serve(app.callback(), { port: port });
