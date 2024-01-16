import * as formDataController from "../framework/formData.js";
import * as model from "../model/messageModel.js";
import * as getUserByIdJs from "../model/userModel.js";
import * as csfr from "../framework/csrf.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

// { KEY:VALUE, KEY_2, VALUE_2 }

export const login = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  if (ctx.session.csrf !== formData._csrf) {
    ctx.response.status = 403;
    return;
  }
  const users = getUserByIdJs.getUsers(ctx.db);

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
    ctx.session.flash = "Eingeloggt";
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: `/admin` },
    });
  } else {
    ctx.session.flash = "Benutzername und Passwort stimmen nicht überein";
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: `/login` },
    });
  }

  return ctx;
};

export const get = async (ctx) => {
  ctx.session.csrf = csfr.generateToken();
  ctx.response.body = await ctx.nunjucks.render("login.html", {
    csrf: ctx.session.csrf,
  });
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
