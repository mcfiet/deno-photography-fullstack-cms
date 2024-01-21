import * as albumModel from "../model/albumModel.js";
import * as csrf from "../helper/csrf.js";

export const get = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  return ctx.setResponse(
    await ctx.render(`fotos.html`, {
      albums: albumModel.getAlbums(ctx.db),
      album_categories: albumModel.getAlbumCategories(ctx.db),
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};
