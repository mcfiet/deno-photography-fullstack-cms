import * as sqlite from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { createContext } from "./framework/context.js";
import * as controllerPreis from "./notes/controllerPreis.js";
import * as controllerPost from "./notes/controllerPost.js";
import * as controllerGet from "./notes/controllerGet.js";
import * as serveStaticFiles from "./middleware/serveStaticFiles.js";
import nunjucks from "npm:nunjucks@3.2.4";
const db = new sqlite.DB("./data/data.db");
//console.table(db.queryEntries("SELECT * FROM notes;"));

nunjucks.configure("templates", {
  autoescape: true,
  noCache: true,
});

/**
 * Handle one HTTP request.
 * @param {Request} request
 * @returns {Response}
 */
export const handleRequest = async (request) => {
  let ctx = createContext(request, {
    db,
    staticPath: "web",
    staticBase: "E:/Git/www-ha-fisc4884-masc3346/public",
    //staticBase: "C:/Users/Mettis/OneDrive - Hochschule Flensburg/WWW-Programmierung/HAUSARBEIT/www-ha-fisc4884-masc3346/public"
    nunjucks,
  });

  let albumId = getId(ctx, "gallerie");

  let id = getId(ctx, "delete");

  if (ctx.request.method == "GET") {
    switch (ctx.url.pathname) {
      case "/":
        //console.log("index");
        ctx = await controllerGet.getIndex(ctx);
        break;

      case "/gallerie":
        //console.log("gallerie");
        ctx = await controllerGet.getGallerie(ctx);
        break;

      case `/gallerie/${albumId}`:
        ctx = await controllerGet.getGallerieDetailseite(ctx, albumId);
        break;

      case "/preise":
        //console.log("preise");
        ctx = await controllerPreis.get(ctx);
        break;

      case "/ueber-mich":
        //console.log("ueber-mich");
        ctx = await controllerGet.getUeberMich(ctx);
        break;

      case "/kontakt":
        //console.log("kontakt");
        ctx = await controllerGet.getKontakt(ctx);
        break;

      case "/admin":
        //console.log("kontakt");
        ctx = await controllerGet.getAdmin(ctx);
        break;

      case `/delete/${id}`:
        ctx = await controllerPreis.remove(ctx, id);
        break;

      case "/login":
        ctx = await controllerGet.getLogin(ctx);
        break;

      case "/logout":
        ctx = await controllerGet.getLogout(ctx);
        break;
    }
  } else if (ctx.request.method == "POST") {
    switch (ctx.url.pathname) {
      case "/addProduct":
        ctx = await controllerPreis.add(ctx);
        break;
      case "/preise":
        ctx = await controllerPreis.update(ctx);
        break;
      case "/login":
        ctx = await controllerPost.login(ctx);
        break;
      case `/gallerie/${albumId}`:
        ctx = await controllerPost.addImage(ctx, albumId);
        break;
      case `/gallerie`:
        ctx = await controllerPost.addAlbum(ctx);
        break;
      case "/admin":
        ctx = await controllerPost.admin(ctx);
        break;
    }
  }

  ctx = await serveStaticFiles.serveStaticFile(ctx);

  if (ctx.response.body == "") {
    ctx = await controllerGet.getError404(ctx);
  }

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
