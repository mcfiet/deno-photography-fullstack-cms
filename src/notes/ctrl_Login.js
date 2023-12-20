import * as formDataController from "../framework/formData.js";
import * as model from "../notes/model.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

// { KEY:VALUE, KEY_2, VALUE_2 }

export const login = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  //const pwHash = "$2a$10$i7.fFIzrTlyGtsaTI1WLEeU9vG8UHnqAWjiW.htmPeMoKnYQVvYgG";
  //await bcrypt.compare("test", pwHash);
  //const user = model.getUserById(ctx.db, 1);
  const users = model.getUsers(ctx.db);
  console.log(users);

  for (const user of users) {
    if (
      formData.username == user.username &&
      (await bcrypt.compare(formData.password, user.password))
    ) {
      ctx.session.user = user;
      ctx.session.state.isLoggedIn = true;
    }
  }

  console.log("Session User: ", ctx.session.user);
  if (ctx.session.state.isLoggedIn) {
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
  ctx.session = {};
  console.log("SessionXXX", ctx.session);
  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/");
  return ctx;
};
