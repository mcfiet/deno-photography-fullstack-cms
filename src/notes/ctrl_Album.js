import * as model from "./model.js";
import * as formDataController from "../framework/formData.js";
import * as albumDelete from "../framework/albumDelete.js";
import * as imageValidation from "../framework/imageValidation.js";
import * as imageHandler from "../framework/imageHandler.js";

export const get = async (ctx, albumId) => {
  ctx.response.body = await ctx.nunjucks.render("album.html", {
    isLoggedIn: ctx.session.state.isLoggedIn,
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
    await imageHandler.createDir(albumId);
    await imageHandler.saveImage(ctx.db, upload, albumId);
  } else {
    console.log(imageValidation.validateImage(upload));
  }

  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", `/gallerie/${albumId}`);
  return ctx;
};

export const getDeleteImage = async (ctx, imageId) => {
  ctx.response.body = await ctx.nunjucks.render("delete-img.html", {
    imageId,
    imageLink: model.getImageById(ctx.db, imageId).albums_images_link,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const deleteImage = async (ctx, imageId) => {
  const albumId = model.getAlbumIdByImageId(ctx.db, imageId);

  imageHandler.deleteImage(ctx.db, model.getImageById(ctx.db, imageId));

  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", `/gallerie/${albumId}`);
  return ctx;
};
