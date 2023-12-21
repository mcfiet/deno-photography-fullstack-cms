import * as model from "./model.js";
import * as formDataController from "../framework/formData.js";
import * as albumDelete from "../framework/albumDelete.js";

export const get = async (ctx) => {
  let albumImages = model.getAlbumImagesById(ctx.db, ctx.params);

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

  console.log(albumImages);

  ctx.response.body = await ctx.nunjucks.render("album.html", {
    isLoggedIn: ctx.session.state.isLoggedIn,
    albumImages,
    album: model.getAlbumById(ctx.db, ctx.params),
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const update = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  model.updateAlbum(ctx.db, formData, ctx.params);
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

  model.addAlbum(ctx.db, formData);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/fotos" },
  });
  return ctx;
};

export const removeConfirmation = async (ctx) => {
  const album = model.getAlbumById(ctx.db, ctx.params);

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
  model.deleteAlbum(ctx.db, ctx.params);
  albumDelete.deleteAlbum(ctx.params);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/fotos" },
  });
  return ctx;
};
