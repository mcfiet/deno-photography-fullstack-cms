import * as sqlite from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { createContext } from "./framework/context.js";
import * as controller from "./notes/controller.js";
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
    nunjucks,
  });

  let id = getId(ctx);
  console.log(ctx.url.pathname);

  if (ctx.request.method == "GET") {
    switch (ctx.url.pathname) {
      case "/":
        //console.log("index");
        ctx = await controller.getIndex(ctx);

        break;

      case "/gallerie":
        //console.log("gallerie");
        ctx = await controller.getGallerie(ctx);
        break;

      case "/preise":
        //console.log("preise");
        ctx = await controller.getPreise(ctx);
        break;

      case "/ueber-mich":
        //console.log("ueber-mich");
        ctx = await controller.getUeberMich(ctx);
        break;

      case "/kontakt":
        //console.log("kontakt");
        ctx = await controller.getKontakt(ctx);
        break;
      case "/admin":
        //console.log("kontakt");
        ctx = await controller.getAdmin(ctx);
        break;
      case "/addProduct":
        //console.log("get add product");
        ctx = await controller.getAddProduct(ctx);
        break;
    }
  } else if (ctx.request.method == "POST") {
    switch (ctx.url.pathname) {
      case "/addProduct":
        //console.log("add product");
        ctx = await controller.postAddProduct(ctx);
        break;
    }
  }

  ctx = await serveStaticFiles.serveStaticFile(ctx);

  if (ctx.response.body == "") {
    ctx = await controller.getError404(ctx);
  }

  return new Response(ctx.response.body, {
    status: ctx.response.status,
    headers: ctx.response.headers,
  });
};

function getId(ctx) {
  const pattern = new URLPattern(ctx.url.origin + "/edit/:id");
  const match = pattern.exec(ctx.url);
  let id = null;
  if (match) {
    return match.pathname.groups.id;
  }
}
