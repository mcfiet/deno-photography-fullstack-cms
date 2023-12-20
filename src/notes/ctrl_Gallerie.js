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
  ctx.response.headers.set("location", `/fotos`);
  return ctx;
};

export const getDelete = async (ctx, id) => {
  const album = model.getAlbumById(ctx.db, id);

  ctx.response.body = await ctx.nunjucks.render(
    `albumDeleteConfirmation.html`,
    {
      isLoggedIn: ctx.session.state.isLoggedIn,
      item: album,
      id: id,
    }
  );
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const remove = (ctx, albumId) => {
  model.deleteAlbum(ctx.db, albumId);
  albumDelete.deleteAlbum(albumId);

  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", `/fotos`);
  return ctx;
};
