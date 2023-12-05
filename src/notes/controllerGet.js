import * as model from "./model.js";

let isLoggedIn = true;

export const getIndex = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("index.html", {
    isLoggedIn: isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getGallerie = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("gallerie.html", {
    isLoggedIn: isLoggedIn,
    albums: model.getAlbums(ctx.db),
    album_categories: model.getAlbumCategories(ctx.db),
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getGallerieDetailseite = async (ctx, albumId) => {
  ctx.response.body = await ctx.nunjucks.render("gallerie_detailseite.html", {
    isLoggedIn: isLoggedIn,
    albumImages: model.getAlbumImagesById(ctx.db, albumId),
    albumName: model.getAlbumNameById(ctx.db, albumId),
    albumId: albumId,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getUeberMich = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("ueber-mich.html", {
    isLoggedIn: isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getKontakt = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("kontakt.html", {
    isLoggedIn: isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getAdmin = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("admin.html");
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getLogin = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("login.html");
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getLogout = async (ctx) => {
  isLoggedIn = false;
  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/");
  return ctx;
};

export const getError404 = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("error404.html");
  ctx.response.status = 404;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
