import * as getAlbumsJs from "../model/albumModel.js";
import * as formDataController from "../framework/formData.js";
import * as albumHandler from "../framework/albumHandler.js";
import * as messages from "../framework/messages.js";

export const get = async (ctx) => {
  let albumImages = getAlbumsJs.getAlbumImagesById(ctx.db, ctx.params);

  if (ctx.session.cart) {
    albumImages.forEach((image) => {
      image.isInCart = false;
      ctx.session.cart.images.forEach((imageFromCart) => {
        if (image.image_id === imageFromCart.image_id) {
          image.isInCart = true;
        }
      });
    });
  }

  return ctx.setResponse(
    await ctx.render(`album.html`, {
      albumImages,
      album: getAlbumsJs.getAlbumById(ctx.db, ctx.params),
    }),
    200,
    "text/html"
  );
};

export const update = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  getAlbumsJs.updateAlbum(ctx.db, formData, ctx.params);
  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/fotos/${ctx.params}` },
  });
  ctx.session.flash = messages.UPDATE_ALBUM_SUCCESS;
  return ctx;
};

export const add = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (formData.category == "Motocross") {
    formData.category = 2;
  } else if (formData.category == "Pferde") {
    formData.category = 1;
  }

  getAlbumsJs.addAlbum(ctx.db, formData);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/fotos" },
  });

  ctx.session.flash = messages.ADD_ALBUM_SUCCESS;
  return ctx;
};

export const removeConfirmation = async (ctx) => {
  //console.log(ctx.params);
  const album = getAlbumsJs.getAlbumById(ctx.db, ctx.params);

  return ctx.setResponse(
    await ctx.render(`albumDeleteForm.html`, {
      item: album,
      id: ctx.params,
    }),
    200,
    "text/html"
  );
};

export const remove = (ctx) => {
  getAlbumsJs.deleteAlbum(ctx.db, ctx.params);
  albumHandler.deleteAlbum(ctx.params);
  ctx.session.flash = messages.REMOVE_ALBUM_SUCCESS;
  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/fotos" },
  });
  return ctx;
};
