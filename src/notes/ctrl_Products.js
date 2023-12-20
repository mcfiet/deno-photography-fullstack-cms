import * as model from "./model.js";
import * as formDataController from "../framework/formData.js";

export const get = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("preise.html", {
    products: model.getProducts(ctx.db),
    bundles: model.getBundles(ctx.db),
    isLoggedIn: ctx.session.state.isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const removeConfirmation = async (ctx) => {
  const product = model.getProductById(ctx.db, ctx.params);

  ctx.response.body = await ctx.nunjucks.render(`productDeleteConfirmation.html`, {
    isLoggedIn: ctx.session.state.isLoggedIn,
    item: product,
    id: ctx.params,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const update = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  model.updateProduct(ctx.db, formData, ctx.params);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/products` },
  });
  return ctx;
};

export const remove = async (ctx) => {
  model.deleteProduct(ctx.db, ctx.params);

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
  model.addProduct(ctx.db, formData);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/products` },
  });
  return ctx;
};
