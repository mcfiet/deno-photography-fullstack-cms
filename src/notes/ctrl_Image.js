import * as model from "./model.js";
import * as imageValidation from "../framework/imageValidation.js";
import * as imageHandler from "../framework/imageHandler.js";

export const add = async (ctx) => {
  const formData = await ctx.request.formData();
  const upload = formData.get("upload");
  const albumId = formData.get("album_id");
  if (imageValidation.validateImage(upload) == "Validiert") {
    await imageHandler.createDir(albumId);
    await imageHandler.saveImage(ctx.db, upload, albumId);
  } else {
    console.log(imageValidation.validateImage(upload));
  }

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/fotos/${albumId}` },
  });
  return ctx;
};

export const removeConfirmation = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("imageDeleteConfirmation.html", {
    imageId: ctx.params,
    imageLink: model.getImageById(ctx.db, ctx.params).albums_images_link,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const remove = async (ctx) => {
  const albumId = model.getAlbumIdByImageId(ctx.db, ctx.params);

  imageHandler.deleteImage(ctx.db, model.getImageById(ctx.db, ctx.params));

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/fotos/${albumId}` },
  });
  return ctx;
};
