import * as model from "../model/messageModel.js";
import * as getAlbumsJs from "../model/albumModel.js";

export const get = async (ctx) => {
  let cartAmount;

  return ctx.setResponse(
    await ctx.render(`gallerie.html`, {
      albums: getAlbumsJs.getAlbums(ctx.db),
      album_categories: getAlbumsJs.getAlbumCategories(ctx.db),
    }),
    200,
    "text/html"
  );
};
