import * as sqlite from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { createContext } from "./framework/context.js";
import * as controller from "./notes/controller.js";

import nunjucks from "npm:nunjucks@3.2.4";
const db = new sqlite.DB("./data/notes.db");
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
    staticBase:
      "G:/Andere Computer/FIETE-PC/Dokumente/Studium/HS Flensburg/ARBEITEN/SEMESTER 5/WWW-PROGRAMMIERUNG/LABOR-06/mvc-fisc4884/public",
    nunjucks,
  });

  let id = getId(ctx);

  switch (ctx.url.pathname) {
    case "/":
      console.log("index");
      ctx = await controller.getIndex(ctx);
      break;

    case "/gallerie":
      console.log("gallerie");
      ctx = await controller.getGallerie(ctx);
      break;

    case "/preise":
      console.log("preise");
      ctx = await controller.getPreise(ctx);
      break;

    case "/ueber-mich":
      console.log("ueber-mich");
      ctx = await controller.getUeberMich(ctx);
      break;

    case "/kontakt":
      console.log("kontakt");
      ctx = await controller.getKontakt(ctx);
      break;
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
