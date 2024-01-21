import * as albumModel from "../model/albumModel.js";
import * as formDataController from "../helper/formData.js";
import * as albumHandler from "../helper/albumHandler.js";
import * as messages from "../helper/messages.js";
import { getFormErrors } from "../helper/validation.js";
import * as csrf from "../helper/csrf.js";

export const get = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

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

  return ctx.setResponse(
    await ctx.render(`album.html`, {
      albumImages,
      album: albumModel.getAlbumById(ctx.db, ctx.params),
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};

export const update = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  formData.category = albumModel.getCategoryByAlbumId(ctx.db, ctx.params);
  formData.album_id = ctx.params;
  ctx.state.formErrors = getFormErrors(formData);
  if (!Object.values(ctx.state.formErrors).some((el) => el !== undefined)) {
    if (ctx.state.CanUpdateAlbum) {
      albumModel.updateAlbum(ctx.db, formData, ctx.params);
      ctx.session.flash = messages.UPDATE_ALBUM_SUCCESS;
      return (ctx.redirect = new Response("", {
        status: 303,
        headers: { Location: `/fotos/${ctx.params}` },
      }));
    } else {
      return (ctx.response.status = 403);
    }
  } else {
    return ctx.setResponse(
      await ctx.render(`albumErrorForm.html`, {
        ...formData,
      }),
      200,
      "text/html"
    );
  }
};

export const add = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  const category_name = formData.category;
  formData.category = {
    category_name,
  };

  ctx.state.formErrors = getFormErrors(formData);

  if (!Object.values(ctx.state.formErrors).some((el) => el !== undefined)) {
    if (ctx.state.CanAddAlbum) {
      if (formData.category.category_name == "Motocross") {
        formData.category.category_id = 2;
      } else if (formData.category.category_name == "Pferde") {
        formData.category.category_id = 1;
      }
      albumModel.addAlbum(ctx.db, formData);

      ctx.session.flash = messages.ADD_ALBUM_SUCCESS;
      return (ctx.redirect = new Response("", {
        status: 303,
        headers: { Location: "/fotos" },
      }));
    } else {
      return (ctx.response.status = 403);
    }
  } else {
    return ctx.setResponse(
      await ctx.render(`albumErrorForm.html`, {
        ...formData,
      }),
      200,
      "text/html"
    );
  }
};

export const removeForm = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  const album = albumModel.getAlbumById(ctx.db, ctx.params);

  return ctx.setResponse(
    await ctx.render(`albumRemoveForm.html`, {
      csrf: ctx.session.csrf,
      item: album,
      id: ctx.params,
    }),
    200,
    "text/html"
  );
};

export const remove = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  albumModel.deleteAlbum(ctx.db, ctx.params);
  albumHandler.deleteAlbum(ctx.params);
  ctx.session.flash = messages.REMOVE_ALBUM_SUCCESS;
  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/fotos" },
  });
  return ctx;
};
