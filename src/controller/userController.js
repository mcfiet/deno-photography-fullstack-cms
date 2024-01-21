import * as userModel from "../model/userModel.js";
import * as roleModel from "../model/roleModel.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as csrf from "../framework/csrf.js";
import * as messages from "../framework/messages.js";
import { getFormErrors } from "../framework/validation.js";

export const editUser = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  const user = userModel.getUserById(ctx.db, ctx.params);

  const formData = {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    userRoles: roleModel.getRolesByUserId(ctx.db, user.user_id),
    roles: roleModel.getRoles(ctx.db),
  };

  if (ctx.state.CanUpdateUser) {
    return ctx.setResponse(
      await ctx.render(`user.html`, {
        csrf: ctx.session.csrf,
        formData,
      }),
      200,
      "text/html"
    );
  } else {
    return (ctx.response.status = 403);
  }
};

export const saveUser = async (ctx) => {
  const formDataRaw = await ctx.request.formData();
  const formData = Object.fromEntries(await formDataRaw.entries());

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  let roleIds = await formDataRaw.getAll("role");
  roleIds = roleIds.map(Number);

  formData.user_id = ctx.params;
  formData.userRoles = roleModel.getRolesByUserId(ctx.db, ctx.params);
  formData.roles = roleModel.getRoles(ctx.db);

  ctx.state.formErrors = getFormErrors(formData);

  if (!Object.values(ctx.state.formErrors).some((el) => el !== undefined)) {
    const passwordHash = await bcrypt.hash(formData.password);
    if (ctx.state.CanUpdateUser) {
      userModel.updateUser(ctx.db, formData, passwordHash, ctx.params, roleIds);
      ctx.session.flash = messages.UPDATE_USER_SUCCESS;
      return (ctx.redirect = new Response("", {
        status: 303,
        headers: { Location: "/admin" },
      }));
    } else {
      ctx.response.status = 403;
      return;
    }
  } else {
    return ctx.setResponse(
      await ctx.render(`user.html`, {
        csrf: ctx.session.csrf,
        formData,
      }),
      200,
      "text/html"
    );
  }
};

export const addUserForm = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();
  if (ctx.state.CanAddUser) {
    return ctx.setResponse(
      await ctx.render(`user.html`, {
        roles: roleModel.getRoles(ctx.db),
        csrf: ctx.session.csrf,
      }),
      200,
      "text/html"
    );
  } else {
    return (ctx.response.status = 403);
  }
};

export const addUser = async (ctx) => {
  const formDataRaw = await ctx.request.formData();
  const formData = Object.fromEntries(await formDataRaw.entries());

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  ctx.state.formErrors = getFormErrors(formData);

  if (!Object.values(ctx.state.formErrors).some((el) => el !== undefined)) {
    let roleIds = await formDataRaw.getAll("role");
    roleIds = roleIds.map(Number);

    formData.password = await bcrypt.hash(formData.password);

    if (ctx.state.CanAddUser) {
      userModel.addUser(ctx.db, formData, roleIds);
      ctx.redirect = new Response("", {
        status: 303,
        headers: { Location: "/admin" },
      });
      ctx.session.flash = messages.ADD_USER_SUCCESS;
    } else {
      ctx.response.status = 403;
      return;
    }
  } else {
    ctx.session.csrf = csrf.generateToken();
    formData.password = "";
    return ctx.setResponse(
      await ctx.render(`user.html`, {
        roles: roleModel.getRoles(ctx.db),
        formData: formData,
        csrf: ctx.session.csrf,
      }),
      200,
      "text/html"
    );
  }

  return ctx;
};

export const remove = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  if (ctx.state.CanRemoveUser) {
    userModel.removeUser(ctx.db, ctx.params);
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
    ctx.session.flash = messages.REMOVE_USER_SUCCESS + " ID: " + ctx.params;
  } else {
    return (ctx.response.status = 403);
  }
  return ctx;
};

export const removeForm = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  const user = userModel.getUserById(ctx.db, ctx.params);

  return ctx.setResponse(
    await ctx.render(`userRemoveForm.html`, {
      ...user,
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};
