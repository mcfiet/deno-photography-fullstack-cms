import * as userModel from "../model/userModel.js";
import * as roleModel from "../model/roleModel.js";
import * as messages from "../helper/messages.js";
import * as csrf from "../helper/csrf.js";
import { getFormErrors } from "../helper/validation.js";

export const addForm = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();
  const permissions = userModel.getPermissions(ctx.db);

  return ctx.setResponse(
    await ctx.render(`roleEdit.html`, {
      permissions,
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};
export const add = async (ctx) => {
  const formDataRaw = await ctx.request.formData();
  const formData = Object.fromEntries(await formDataRaw.entries());

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  ctx.state.formErrors = getFormErrors(formData);

  formData.permissionIds = await formDataRaw.getAll("permission").map(Number);
  formData.permissionsToRole = roleModel.getPermissionsByIds(
    ctx.db,
    formData.permissionIds
  );
  formData.permissions = userModel.getPermissions(ctx.db);

  if (!Object.values(ctx.state.formErrors).some((el) => el !== undefined)) {
    if (ctx.state.CanAddRole) {
      ctx.session.flash = roleModel.addRole(ctx.db, formData);
    }
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  } else {
    return ctx.setResponse(
      await ctx.render(`roleEdit.html`, {
        csrf: ctx.session.csrf,
        ...formData,
      }),
      200,
      "text/html"
    );
  }
};

export const edit = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  const role = roleModel.getRoleById(ctx.db, ctx.params);

  return ctx.setResponse(
    await ctx.render(`roleEdit.html`, {
      ...role,
      permissions: userModel.getPermissions(ctx.db),
      permissionsToRole: userModel.getPermissionsByRoleId(ctx.db, ctx.params),
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};

export const save = async (ctx) => {
  const formDataRaw = await ctx.request.formData();
  const formData = Object.fromEntries(await formDataRaw.entries());

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  formData.role_id = ctx.params;
  formData.permissionIds = await formDataRaw.getAll("permission").map(Number);
  formData.permissionsToRole = roleModel.getPermissionsByIds(
    ctx.db,
    formData.permissionIds
  );
  formData.permissions = userModel.getPermissions(ctx.db);

  ctx.state.formErrors = getFormErrors(formData);

  if (!Object.values(ctx.state.formErrors).some((el) => el !== undefined)) {
    if (ctx.state.CanUpdateRole) {
      ctx.session.flash = roleModel.updateRole(ctx.db, formData);

      ctx.redirect = new Response("", {
        status: 303,
        headers: { Location: "/admin" },
      });
    } else {
      return (ctx.response.status = 403);
    }
  } else {
    return ctx.setResponse(
      await ctx.render(`roleEdit.html`, {
        csrf: ctx.session.csrf,
        ...formData,
      }),
      200,
      "text/html"
    );
  }
};

export const remove = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  if (ctx.state.CanRemoveRole) {
    roleModel.removeRole(ctx.db, ctx.params);
    ctx.session.flash = messages.REMOVE_ROLE_SUCCESS + " ID: " + ctx.params;
  } else {
    return (ctx.response.status = 403);
  }

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/admin" },
  });
};

export const removeForm = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  const role = roleModel.getRoleById(ctx.db, ctx.params);

  return ctx.setResponse(
    await ctx.render(`roleRemoveForm.html`, {
      ...role,
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};
