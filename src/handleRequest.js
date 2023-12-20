import { createContext } from "./framework/context.js";
import * as ctrl_Preise from "./notes/ctrl_Products.js";
import * as ctrl_Gallerie from "./notes/ctrl_Fotos.js";
import * as ctrl_Album from "./notes/ctrl_Album.js";
import * as ctrl_Login from "./notes/ctrl_Login.js";
import * as controller from "./notes/controller.js";
import * as serveStaticFiles from "./middleware/serveStaticFiles.js";
import { createId } from "./middleware/session.js";
import { CookieMap, mergeHeaders } from "https://deno.land/std/http/mod.ts";
import { getId, SESSION_KEY, getImageDelete, MAX_AGE } from "./app.js";

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

  console.log(getId(ctx, "product/update"));
  // Get cookie
  ctx.cookies = new CookieMap(ctx.request);

  // Get Session
  ctx.sessionId = ctx.cookies.get(SESSION_KEY);

  ctx.session = ctx.sessionStore.get(ctx.sessionId) ?? {
    user: {},
    state: { isLoggedIn: null },
  };

  let idImage = getId(ctx, "delete-img");

  let albumId = getId(ctx, "fotos");
  let albumIdDelete = getId(ctx, "fotos/delete");
  let imageDelete = getImageDelete(ctx);

  let id = getId(ctx, "delete");

  if (ctx.request.method == "GET") {
    switch (ctx.url.pathname) {
      case "/":
        //console.log("index");
        ctx = await controller.get(ctx, "index", 200);
        break;

      case "/fotos":
        //console.log("fotos");
        ctx = await ctrl_Gallerie.get(ctx);
        break;

      case `/fotos/${getId(ctx, "fotos")}`:
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

      case `/image/delete`:
        ctx = await ctrl_Album.getDeleteImage(ctx, idImage);
        break;

      case `/album/delete`:
        ctx = await ctrl_Gallerie.remove(ctx, albumIdDelete);
        break;

      case `/product/delete`:
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
      case "/product/add":
        ctx = await ctrl_Preise.add(ctx);
        break;

      case `/product/delete/${getId(ctx, "product/delete")}`:
        ctx = await ctrl_Preise.remove(ctx, getId(ctx, "product/delete"));
        break;

      case `/product/update/${getId(ctx, "product/update")}`:
        ctx = await ctrl_Preise.update(ctx, getId(ctx, "product/update"));
        break;

      case "/login":
        ctx = await ctrl_Login.login(ctx);
        break;

      case `/image/add`:
        ctx = await ctrl_Album.addImage(ctx, albumId);
        break;

      case `/image/delete/${getId(ctx, "image/delete")}`:
        ctx = await ctrl_Album.deleteImage(ctx, getId(ctx, "image/delete"));
        break;

      case `/image/addToCart/${getId(ctx, "image/addToCart")}`:
        ctx = await ctrl_Album.addImage(ctx, albumId);
        break;

      case `/image/removeFromCart/${getId(ctx, "image/removeFromCart")}`:
        ctx = await ctrl_Album.addImage(ctx, albumId);
        break;

      case `/fotos`:
        ctx = await ctrl_Gallerie.add(ctx);
        break;

      case "/admin":
        ctx = await controllerPost.admin(ctx);
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
