import * as formDataController from "../framework/formData.js";
import * as model from "../notes/model.js";
// { KEY:VALUE, KEY_2, VALUE_2 }

let isLoggedIn = true;

export const login = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  if (formData.username == "test" && formData.password == "test") {
    isLoggedIn = true;
  }

  if (isLoggedIn) {
    ctx.response.body = null;
    ctx.response.status = 303;
    ctx.response.headers.set("location", "/");
  } else {
    ctx.response.body = null;
    ctx.response.status = 303;
    ctx.response.headers.set("location", "/login");
  }

  return ctx;
};

export const get = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("login.html");
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const logout = async (ctx) => {
  isLoggedIn = false;
  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/");
  return ctx;
};
