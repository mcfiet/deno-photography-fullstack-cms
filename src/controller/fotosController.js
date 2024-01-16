import * as model from "../model/messageModel.js";
import * as getAlbumsJs from "../model/albumModel.js";

export const get = async (ctx) => {
  let cartAmount;
  if (ctx.session.cart) {
    cartAmount = ctx.session.cart.images.length;
  }
  ctx.response.body = await ctx.nunjucks.render("gallerie.html", {
    cartAmount,
    isLoggedIn: ctx.session.state.isLoggedIn,
    albums: getAlbumsJs.getAlbums(ctx.db),
    album_categories: getAlbumsJs.getAlbumCategories(ctx.db),
    state: ctx.state,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
