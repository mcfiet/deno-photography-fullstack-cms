import * as model from "../model/messageModel.js";
import * as getUserByIdJs from "../model/userModel.js";
import * as formDataController from "../framework/formData.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

export const index = async (ctx) => {
  //console.log(model.getPermissionByUserId(ctx.db, ctx.session.user.user_id));
  //console.log("PERMISSION", model.getUsers(ctx.db)[0].roles[0].permissions);

  if (ctx.session.state.isLoggedIn) {
    let users = getUserByIdJs.getUsers(ctx.db);
    for (const user of users) {
      user.roles = getUserByIdJs.getRolesByUserId(ctx.db, user.user_id);
    }

    ctx.response.body = await ctx.nunjucks.render(`admin.html`, {
      isLoggedIn: ctx.session.state.isLoggedIn,
      userLoggedIn: ctx.state.user,
      users,
      messages: model.getMessages(ctx.db),
      state: ctx.state,
      flash: ctx.session.flash,
    });
    ctx.response.status = 200;
    ctx.response.headers.set("content-type", "text/html");
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/login" },
    });
  }

  return ctx;
};

export const editUser = async (ctx) => {
  const user = getUserByIdJs.getUserById(ctx.db, ctx.params);
  if (ctx.session.state.isLoggedIn) {
    ctx.response.body = await ctx.nunjucks.render(`editUser.html`, {
      isLoggedIn: ctx.session.state.isLoggedIn,
      user,
      roles: getUserByIdJs.getRolesByUserId(ctx.db, user.user_id),
    });
    ctx.response.status = 200;
    ctx.response.headers.set("content-type", "text/html");
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/login" },
    });
  }
  return ctx;
};

export const saveUser = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  const passwordHash = await bcrypt.hash(formData.password);
  if (ctx.session.state.isLoggedIn && ctx.session.user.role_id == 1) {
    getUserByIdJs.updateUser(ctx.db, formData, passwordHash, ctx.params);
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  }
  return ctx;
};
export const addUserForm = async (ctx) => {
  if (ctx.session.state.isLoggedIn) {
    ctx.response.body = await ctx.nunjucks.render(`addUser.html`, {
      isLoggedIn: ctx.session.state.isLoggedIn,
      roles: getUserByIdJs.getRoles(ctx.db),
    });
    ctx.response.status = 200;
    ctx.response.headers.set("content-type", "text/html");
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/login" },
    });
  }
  return ctx;
};

export const addUser = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  const passwordHash = await bcrypt.hash(formData.password);
  if (ctx.session.state.isLoggedIn && ctx.session.user.role_id == 1) {
    getUserByIdJs.addUser(ctx.db, formData, passwordHash);
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  }
  return ctx;
};
