import * as formDataController from "../framework/formData.js";
import * as messages from "../framework/messages.js";
import * as userModel from "../model/userModel.js";
import * as csrf from "../framework/csrf.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { getFormErrors } from "../framework/validation.js";

export const login = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }
  const users = userModel.getUsers(ctx.db);
  let authenticated = false;
  for (const user of users) {
    if (
      formData.email == user.email &&
      (await bcrypt.compare(formData.password, user.password))
    ) {
      ctx.session.user = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      };
      authenticated = true;
    }
  }
  if (authenticated) {
    ctx.session.flash = messages.LOGGEDIN_SUCCESS;
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: `/` },
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
  ctx.session.csrf = csrf.generateToken();
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

export const registerForm = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();
  ctx.setResponse(
    await ctx.render(`register.html`, {
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
  return ctx;
};

export const register = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }
  ctx.state.formErrors = getFormErrors(formData);

  if (!Object.values(ctx.state.formErrors).some((el) => el !== undefined)) {
    formData.password = await bcrypt.hash(formData.password);
    ctx.session.flash = userModel.registerUser(ctx.db, formData);
    if (ctx.session.flash == "") {
      ctx.session.flash = "Registriert";
      ctx.redirect = new Response("", {
        status: 303,
        headers: { Location: "/login" },
      });
    } else {
      ctx.redirect = new Response("", {
        status: 303,
        headers: { Location: "/register" },
      });
    }
  } else {
    ctx.session.csrf = csrf.generateToken();

    formData.password = undefined;
    console.log(formData);
    ctx.setResponse(
      await ctx.render(`register.html`, {
        csrf: ctx.session.csrf,
        formData,
      }),
      200,
      "text/html"
    );
  }

  return ctx;
};
