import * as formDataController from "../framework/formData.js";
import * as messages from "../framework/messages.js";
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

  let authenticated = false;
  for (const user of users) {
    if (
      formData.username == user.username &&
      (await bcrypt.compare(formData.password, user.password))
    ) {
      ctx.session.user = {
        user_id: user.user_id,
        username: user.username,
      };
      authenticated = true;
    }
  }

  if (authenticated) {
    ctx.session.flash = messages.LOGGEDIN_SUCCESS;
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: `/admin` },
    });
  } else {
    ctx.session.flash = messages.LOGGEDIN_FAILURE;
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: `/login` },
    });
  }

  return ctx;
};

export const get = async (ctx) => {
  ctx.session.csrf = csfr.generateToken();
  return ctx.setResponse(
    await ctx.render(`login.html`, {
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};

export const logout = async (ctx) => {
  ctx.session = {};

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/` },
  });
  return ctx;
};
