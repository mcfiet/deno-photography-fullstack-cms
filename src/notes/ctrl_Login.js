import * as formDataController from "../framework/formData.js";
import * as model from "../notes/model.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

// { KEY:VALUE, KEY_2, VALUE_2 }

export const login = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  const users = model.getUsers(ctx.db);

  for (const user of users) {
    if (
      formData.username == user.username &&
      (await bcrypt.compare(formData.password, user.password))
    ) {
      ctx.session.user = user;
      ctx.session.state.isLoggedIn = true;
    }
  }

  if (ctx.session.state.isLoggedIn) {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: `/admin` },
    });
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: `/login` },
    });
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

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/` },
  });
  return ctx;
};
