import * as model from "../model/messageModel.js";
import * as getProductsJs from "../model/productModel.js";
import * as formDataController from "../framework/formData.js";

export const get = async (ctx) => {
  let cartAmount;
  if (ctx.session.cart) {
    cartAmount = ctx.session.cart.images.length;
  }
  ctx.response.body = await ctx.nunjucks.render("preise.html", {
    cartAmount,
    products: getProductsJs.getProducts(ctx.db),
    bundles: getProductsJs.getBundles(ctx.db),
    isLoggedIn: ctx.session.state.isLoggedIn,
    state: ctx.state,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const removeConfirmation = async (ctx) => {
  const product = getProductsJs.getProductById(ctx.db, ctx.params);

  ctx.response.body = await ctx.nunjucks.render(
    `productDeleteConfirmation.html`,
    {
      isLoggedIn: ctx.session.state.isLoggedIn,
      item: product,
      id: ctx.params,
    }
  );
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const update = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  getProductsJs.updateProduct(ctx.db, formData, ctx.params);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/products` },
  });
  return ctx;
};

export const remove = async (ctx) => {
  getProductsJs.deleteProduct(ctx.db, ctx.params);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/products` },
  });
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
  return ctx;
};
