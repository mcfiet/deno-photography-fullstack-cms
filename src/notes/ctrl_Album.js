import * as model from "./model.js";
import * as formDataController from "../framework/formData.js";
import * as albumDelete from "../framework/albumDelete.js";
import * as imageValidation from "../framework/imageValidation.js";
import * as imageSaving from "../framework/imageSaving.js";

let isLoggedIn = true;

export const get = async (ctx, albumId) => {
  ctx.response.body = await ctx.nunjucks.render("album.html", {
    isLoggedIn: isLoggedIn,
    albumImages: model.getAlbumImagesById(ctx.db, albumId),
    albumName: model.getAlbumNameById(ctx.db, albumId),
    albumId: albumId,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const addImage = async (ctx, albumId) => {
  const formData = await ctx.request.formData();
  const upload = formData.get("upload");

  if (imageValidation.validateImage(upload) == "Validiert") {
    await imageSaving.createDir(albumId);
    await imageSaving.saveImage(ctx.db, upload, albumId);
  } else {
    console.log(imageValidation.validateImage(upload));
  }

  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", `/gallerie/${albumId}`);
  return ctx;
};
