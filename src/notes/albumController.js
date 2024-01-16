import * as albumModel from "../model/albumModel.js";
import * as formDataController from "../framework/formData.js";
import * as albumDelete from "../framework/albumHandler.js";

export const get = async (ctx) => {
  let cartAmount;
  if (ctx.session.cart) {
    cartAmount = ctx.session.cart.images.length;
  }
  let albumImages = albumModel.getAlbumImagesById(ctx.db, ctx.params);

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

  //console.log(albumImages);

  ctx.response.body = await ctx.nunjucks.render("album.html", {
    cartAmount,
    isLoggedIn: ctx.session.state.isLoggedIn,
    albumImages,
    album: albumModel.getAlbumById(ctx.db, ctx.params),
    state: ctx.state,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const update = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  albumModel.updateAlbum(ctx.db, formData, ctx.params);
  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/fotos/${ctx.params}` },
  });
  return ctx;
};

export const add = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (formData.category == "Motocross") {
    formData.category = 2;
  } else if (formData.category == "Pferde") {
    formData.category = 1;
  }

  albumModel.addAlbum(ctx.db, formData);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/fotos" },
  });
  return ctx;
};

export const removeConfirmation = async (ctx) => {
  //console.log(ctx.params);
  const album = albumModel.getAlbumById(ctx.db, ctx.params);

  ctx.response.body = await ctx.nunjucks.render(
    `albumDeleteConfirmation.html`,
    {
      isLoggedIn: ctx.session.state.isLoggedIn,
      item: album,
      id: ctx.params,
    }
  );
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const remove = (ctx) => {
  albumModel.deleteAlbum(ctx.db, ctx.params);
  albumDelete.deleteAlbum(ctx.params);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/fotos" },
  });
  return ctx;
};
