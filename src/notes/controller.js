import * as model from "./model.js";
export const getIndex = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("index.html");
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
  ctx.response.body = await ctx.nunjucks.render("preise.html");
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
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
