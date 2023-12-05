import * as model from "./model.js";

let isLoggedIn = true;

export const get = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("preise.html", {
    products: model.getProducts(ctx.db),
    bundles: model.getBundles(ctx.db),
    isLoggedIn: isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const update = async (ctx) => {
  const requestFormData = await ctx.request.formData();

  const formData = {
    id: requestFormData.get("id"),
    name: requestFormData.get("name"),
    text: requestFormData.get("text"),
    price: requestFormData.get("price"),
    priceDes: requestFormData.get("priceDes"),
    bundleAmount: requestFormData.get("bundleAmount"),
  };
  model.updateProduct(ctx.db, formData);
  ctx.response.body = await ctx.nunjucks.render("preise.html", {
    products: model.getProducts(ctx.db),
    bundles: model.getBundles(ctx.db),
    isLoggedIn: isLoggedIn,
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
  const requestFormData = await ctx.request.formData();

  const formData = {
    name: requestFormData.get("name"),
    text: requestFormData.get("text"),
    price: requestFormData.get("price"),
    priceDes: requestFormData.get("priceDes"),
    bundleAmount: requestFormData.get("bundleAmount"),
  };

  if (formData.bundleAmount == "") {
    formData.bundleAmount = null;
  }
  model.addProduct(ctx.db, formData);
  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/preise");
  return ctx;
};
