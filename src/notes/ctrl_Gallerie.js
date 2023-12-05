import * as model from "./model.js";
import * as formDataController from "../framework/formData.js";
import * as albumDelete from "../framework/albumDelete.js";

let isLoggedIn = true;

export const get = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("gallerie.html", {
    isLoggedIn: isLoggedIn,
    albums: model.getAlbums(ctx.db),
    album_categories: model.getAlbumCategories(ctx.db),
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const add = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (formData.category == "Motocross") {
    formData.category = 2;
  } else if (formData.category == "Pferde") {
    formData.category = 1;
  }

  console.log(formData);

  model.addAlbum(ctx.db, formData);

  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", `/gallerie`);
  return ctx;
};

export const remove = (ctx, albumId) => {
  model.deleteAlbum(ctx.db, albumId);
  albumDelete.deleteAlbum(albumId);

  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", `/gallerie`);
  return ctx;
};
