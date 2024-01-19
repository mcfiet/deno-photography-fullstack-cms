import * as model from "../model/messageModel.js";
import * as clientModel from "../model/clientModel.js";
import * as formDataController from "../framework/formData.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import * as messages from "../framework/messages.js";
import * as csfr from "../framework/csrf.js";

export const registerForm = async (ctx) => {
  ctx.session.csrf = csfr.generateToken();
  return ctx.setResponse(
    await ctx.render(`clientRegister.html`, {
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};

export const register = async (ctx) => {
  console.log("test");
  const formData = await formDataController.getEntries(ctx);
  formData.password = await bcrypt.hash(formData.password);

  if (ctx.session.csrf !== formData._csrf) {
    ctx.response.status = 403;
    return;
  }

  ctx.session.flash = clientModel.addClient(ctx.db, formData);
  if (!ctx.session.flash) {
    ctx.session.flash = "Registriert";
    return (ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/login" },
    }));
  } else {
    return (ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/register" },
    }));
  }
};

export const loginForm = async (ctx) => {
  ctx.session.csrf = csfr.generateToken();
  return ctx.setResponse(
    await ctx.render(`clientLogin.html`, {
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};

export const login = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    ctx.response.status = 403;
    return;
  }

  if (ctx.session.user) {
    ctx.session.flash = "Bitte erst als User ausloggen";
    return (ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: `/` },
    }));
  }

  const clients = clientModel.getClients(ctx.db);

  let authenticated = false;
  for (const client of clients) {
    if (
      formData.email == client.client_email &&
      (await bcrypt.compare(formData.password, client.client_password))
    ) {
      ctx.session.client = {
        client_id: client.client_id,
        name: client.client_name,
        email: client.client_email,
      };
      authenticated = true;
    }
  }
  console.log(ctx.session);
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
      headers: { Location: `/client-login` },
    });
  }

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
