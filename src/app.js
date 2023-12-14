import * as sqlite from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { createContext } from "./framework/context.js";
import * as ctrl_Preise from "./notes/ctrl_Preise.js";
import * as ctrl_Gallerie from "./notes/ctrl_Gallerie.js";
import * as ctrl_Album from "./notes/ctrl_Album.js";
import * as ctrl_Login from "./notes/ctrl_Login.js";
import * as controller from "./notes/controller.js";
import * as serveStaticFiles from "./middleware/serveStaticFiles.js";
import nunjucks from "npm:nunjucks@3.2.4";
import { createSessionStore, createId } from "./middleware/session.js";
import * as cookies from "./middleware/cookies.js";
import { cookieMapHeadersInitSymbol } from "https://deno.land/std@0.208.0/http/unstable_cookie_map.ts";
import { encode as base64Encode } from "https://deno.land/std/encoding/base64.ts";
import { CookieMap, mergeHeaders } from "https://deno.land/std/http/mod.ts";

const SESSION_KEY = "my_app.session";
const MAX_AGE = 60 * 60 * 1000; // one hour

const db = new sqlite.DB("./data/data.db");
//console.table(db.queryEntries("SELECT * FROM notes;"));

nunjucks.configure("templates", {
  autoescape: true,
  noCache: true,
});

const sessionStore = createSessionStore();

/**
 * Handle one HTTP request.
 * @param {Request} request
 * @returns {Response}
 */
export const handleRequest = async (request) => {
  let ctx = createContext(request, {
    db,
    staticPath: "web",
    staticBase: `${Deno.cwd()}/public`,
    nunjucks,
    sessionStore,
  });

  // Get cookie
  ctx.cookies = new CookieMap(ctx.request);

  // Get Session
  ctx.sessionId = ctx.cookies.get(SESSION_KEY);

  ctx.session = ctx.sessionStore.get(ctx.sessionId) ?? {
    user: {},
    state: { isLoggedIn: null },
  };

  let idImage = getId(ctx, "delete-img");

  let albumId = getId(ctx, "gallerie");
  let albumIdDelete = getId(ctx, "gallerie/delete");
  let imageDelete = getImageDelete(ctx);

  let id = getId(ctx, "delete");

  if (ctx.request.method == "GET") {
    switch (ctx.url.pathname) {
      case "/":
        //console.log("index");
        ctx = await controller.get(ctx, "index", 200);
        break;

      case "/gallerie":
        //console.log("gallerie");
        ctx = await ctrl_Gallerie.get(ctx);
        break;

      case `/gallerie/${albumId}`:
        ctx = await ctrl_Album.get(ctx, albumId);
        break;

      case "/preise":
        //console.log("preise");
        ctx = await ctrl_Preise.get(ctx);
        break;

      case "/ueber-mich":
        //console.log("ueber-mich");
        ctx = await controller.get(ctx, "ueber-mich", 200);
        break;

      case "/kontakt":
        //console.log("kontakt");
        ctx = await controller.get(ctx, "kontakt", 200);
        break;

      case "/admin":
        //console.log("kontakt");
        ctx = await controller.get(ctx, "admin", 200);
        break;

      case `/delete-img/${idImage}`:
        ctx = await ctrl_Album.getDeleteImage(ctx, idImage);
        break;

      case `/gallerie/delete/${albumIdDelete}`:
        ctx = await ctrl_Gallerie.remove(ctx, albumIdDelete);
        break;

      case `/delete/${id}`:
        ctx = await ctrl_Preise.remove(ctx, id);
        break;

      case "/login":
        ctx = await ctrl_Login.get(ctx);
        break;

      case "/logout":
        ctx = await ctrl_Login.logout(ctx);
        break;
    }
  } else if (ctx.request.method == "POST") {
    switch (ctx.url.pathname) {
      case "/addProduct":
        ctx = await ctrl_Preise.add(ctx);
        break;

      case "/preise":
        ctx = await ctrl_Preise.update(ctx);
        break;

      case "/login":
        ctx = await ctrl_Login.login(ctx);
        break;

      case `/gallerie/${albumId}`:
        ctx = await ctrl_Album.addImage(ctx, albumId);
        break;

      case `/gallerie`:
        ctx = await ctrl_Gallerie.add(ctx);
        break;

      case "/admin":
        ctx = await controllerPost.admin(ctx);
        break;

      case `/delete-img/${idImage}`:
        ctx = await ctrl_Album.deleteImage(ctx, idImage);
        break;
    }
  }

  ctx = await serveStaticFiles.serveStaticFile(ctx);

  if (ctx.response.body == "") {
    ctx = await controller.get(ctx, "error404", 404);
  }

  if (Object.values(ctx.session).some((el) => el !== undefined)) {
    ctx.sessionId = ctx.sessionId ?? createId();
    ctx.sessionStore.set(ctx.sessionId, ctx.session, MAX_AGE);
    const maxAge = new Date(Date.now() + MAX_AGE);
    ctx.cookies.set(SESSION_KEY, ctx.sessionId, {
      expires: maxAge,
      httpOnly: true,
      overwrite: true,
    });
  } else {
    ctx.sessionStore.destroy(ctx.sessionId);
    ctx.cookies.delete(SESSION_KEY);
  }

  // Cookies in Header einbinden (app.js)
  ctx.response.headers = mergeHeaders(ctx.response.headers, ctx.cookies);
  return new Response(ctx.response.body, {
    status: ctx.response.status,
    headers: ctx.response.headers,
  });
};

function getId(ctx, action) {
  const pattern = new URLPattern(ctx.url.origin + `/${action}/:id`);
  const match = pattern.exec(ctx.url);
  if (match) {
    return match.pathname.groups.id;
  }
}

function getImageDelete(ctx) {
  const pattern = new URLPattern(ctx.url.origin + `/:filename/delete`);
  const match = pattern.exec(ctx.url);
  if (match) {
    return match.pathname.groups.filename;
  }
}
