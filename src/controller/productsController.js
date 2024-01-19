import * as messages from "../framework/messages.js";
import * as getProductsJs from "../model/productModel.js";
import * as formDataController from "../framework/formData.js";

export const get = async (ctx) => {
  let cartAmount;
  if (ctx.session.cart) {
    cartAmount = ctx.session.cart.images.length;
  }
  return ctx.setResponse(
    await ctx.render(`preise.html`, {
      products: getProductsJs.getProducts(ctx.db),
      bundles: getProductsJs.getBundles(ctx.db),
    }),
    200,
    "text/html"
  );
};

export const removeConfirmation = async (ctx) => {
  const product = getProductsJs.getProductById(ctx.db, ctx.params);
  return ctx.setResponse(
    await ctx.render(`productRemoveForm.html`, {
      item: product,
      id: ctx.params,
    }),
    200,
    "text/html"
  );
};

export const update = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  getProductsJs.updateProduct(ctx.db, formData, ctx.params);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/products` },
  });
  ctx.session.flash = messages.UPDATE_PRODUCT_SUCCESS;
  return ctx;
};

export const remove = async (ctx) => {
  getProductsJs.deleteProduct(ctx.db, ctx.params);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/products` },
  });
  ctx.session.flash = messages.REMOVE_PRODUCT_SUCCESS;
  return ctx;
};

export const add = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (formData.bundleAmount == "") {
    formData.bundleAmount = null;
  }
  getProductsJs.addProduct(ctx.db, formData);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/products` },
  });
  ctx.session.flash = messages.ADD_PRODUCT_SUCCESS;
  return ctx;
};
