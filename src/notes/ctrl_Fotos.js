import * as model from "./model.js";
import * as formDataController from "../framework/formData.js";
import * as albumDelete from "../framework/albumDelete.js";

export const get = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("gallerie.html", {
    isLoggedIn: ctx.session.state.isLoggedIn,
    albums: model.getAlbums(ctx.db),
    album_categories: model.getAlbumCategories(ctx.db),
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
