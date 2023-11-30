import * as model from "./model.js";

let isLoggedIn = false;

export const getIndex = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("index.html", {
    isLoggedIn: isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
export const getGallerie = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("gallerie.html");
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
export const getPreise = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("preise.html", {
    products: model.getProducts(ctx.db),
    bundles: model.getBundles(ctx.db),
    isLoggedIn: isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
export const postPreise = async (ctx) => {
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
export const deleteProduct = async (ctx, id) => {
  model.deleteProduct(ctx.db, id);
  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/preise");
  return ctx;
};

export const getUeberMich = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("ueber-mich.html");
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getKontakt = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("kontakt.html");
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getAdmin = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("admin.html");
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getAddProduct = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("productForm.html");
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getLogin = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("login.html");
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const getLogout = async (ctx) => {
  isLoggedIn = false;
  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/");
  return ctx;
};
export const postLogin = async (ctx) => {
  const requestFormData = await ctx.request.formData();
  const formData = {
    username: requestFormData.get("username"),
    password: requestFormData.get("password"),
  };
  if (formData.username == "test" && formData.password) {
    isLoggedIn = true;
  }

  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/");
  return ctx;
};
export const addProduct = async (ctx) => {
  const requestFormData = await ctx.request.formData();
  const formData = {
    name: requestFormData.get("name"),
    text: requestFormData.get("text"),
    price: requestFormData.get("price"),
    priceDes: requestFormData.get("priceDes"),
    bundleAmount: requestFormData.get("bundleAmount"),
  };
  model.addProduct(ctx.db, formData);
  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/preise");
  return ctx;
};

export const getError404 = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("error404.html");
  ctx.response.status = 404;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
