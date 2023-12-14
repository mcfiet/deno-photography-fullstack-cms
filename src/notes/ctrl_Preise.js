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

export const update = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  console.log(formData);
  model.updateProduct(ctx.db, formData);
  ctx.response.body = await ctx.nunjucks.render("preise.html", {
    products: model.getProducts(ctx.db),
    bundles: model.getBundles(ctx.db),
    isLoggedIn: ctx.session.state.isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const remove = async (ctx, id) => {
  model.deleteProduct(ctx.db, id);
  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/preise");
  return ctx;
};

export const add = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (formData.bundleAmount == "") {
    formData.bundleAmount = null;
  }
  model.addProduct(ctx.db, formData);
  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/preise");
  return ctx;
};
