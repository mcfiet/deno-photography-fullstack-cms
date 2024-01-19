import * as model from "../model/messageModel.js";
import * as userModel from "../model/userModel.js";
import * as clientModel from "../model/clientModel.js";
import * as formDataController from "../framework/formData.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import * as messages from "../framework/messages.js";

export const index = async (ctx) => {
  //console.log(model.getPermissionByUserId(ctx.db, ctx.session.user.user_id));
  //console.log("PERMISSION", model.getUsers(ctx.db)[0].roles[0].permissions);
  if (ctx.state.authenticated) {
    const users = userModel.getUsers(ctx.db);
    for (const user of users) {
      user.roles = userModel.getRolesByUserId(ctx.db, user.user_id);
    }
    const clients = clientModel.getClients(ctx.db);
    return ctx.setResponse(
      await ctx.render(`admin.html`, {
        users,
        clients,
        roles: userModel.getRoles(ctx.db),
        messages: model.getMessages(ctx.db),
      }),
      200,
      "text/html"
    );
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin-login" },
    });
  }

  return ctx;
};

export const editUser = async (ctx) => {
  const user = userModel.getUserById(ctx.db, ctx.params);
  if (ctx.state.authenticated) {
    return ctx.setResponse(
      await ctx.render(`userEdit.html`, {
        user,
        roles: userModel.getRolesByUserId(ctx.db, user.user_id),
      }),
      200,
      "text/html"
    );
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

  if (ctx.state.CanUpdateUser) {
    userModel.updateUser(ctx.db, formData, passwordHash, ctx.params);
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
    ctx.session.flash = messages.UPDATE_USER_SUCCESS;
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  }
  return ctx;
};

export const addUserForm = async (ctx) => {
  if (ctx.state.authenticated) {
    return ctx.setResponse(
      await ctx.render(`userAdd.html`, {
        roles: userModel.getRoles(ctx.db),
      }),
      200,
      "text/html"
    );
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/login" },
    });
  }
  return ctx;
};

export const addUser = async (ctx) => {
  const formData = await ctx.request.formData();
  const formDataEntries = Object.fromEntries(await formData.entries());
  console.log(formDataEntries);
  let roleIds = await formData.getAll("role");
  roleIds = roleIds.map(Number);

  console.log(roleIds);
  const passwordHash = await bcrypt.hash(formDataEntries.password);
  if (ctx.state.CanAddUser) {
    userModel.addUser(ctx.db, formDataEntries, passwordHash, roleIds);
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
    ctx.session.flash = messages.ADD_USER_SUCCESS;
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  }
  return ctx;
};

export const removeUser = async (ctx) => {
  if (ctx.state.CanRemoveUser) {
    userModel.removeUser(ctx.db, ctx.params);
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
    ctx.session.flash = messages.REMOVE_USER_SUCCESS + " ID: " + ctx.params;
  } else {
    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  }
  return ctx;
};

export const removeUserConfirmation = async (ctx) => {
  const user = userModel.getUserById(ctx.db, ctx.params);

  return ctx.setResponse(
    await ctx.render(`userRemoveForm.html`, {
      ...user,
    }),
    200,
    "text/html"
  );
};

export const addRoleForm = async (ctx) => {
  const permissions = userModel.getPermissions(ctx.db);
  return ctx.setResponse(
    await ctx.render(`roleAdd.html`, {
      permissions,
    }),
    200,
    "text/html"
  );
};
export const addRole = async (ctx) => {
  const addedRole = {};
  const formData = await ctx.request.formData();
  addedRole.name = Object.fromEntries(await formData.entries()).role_name;

  const permissionIds = await formData.getAll("permission");
  addedRole.permissionIds = permissionIds.map(Number);
  if (ctx.state.CanAddRole) {
    console.log(addedRole);
    ctx.session.flash = userModel.addRole(ctx.db, addedRole);
  }

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/admin" },
  });
};

export const editRole = async (ctx) => {
  let role = userModel.getRoleById(ctx.db, ctx.params);
  const permissions = userModel.getPermissions(ctx.db);
  const permissionsToRole = userModel.getPermissionsByRoleId(
    ctx.db,
    ctx.params
  );
  console.log(permissions);
  return ctx.setResponse(
    await ctx.render(`roleEdit.html`, {
      ...role,
      permissions,
      permissionsToRole,
    }),
    200,
    "text/html"
  );
};

export const saveRole = async (ctx) => {
  const updatedRole = {};
  updatedRole.id = ctx.params;
  const formData = await ctx.request.formData();
  updatedRole.name = Object.fromEntries(await formData.entries()).role_name;

  const permissionIds = await formData.getAll("permission");
  updatedRole.permissionIds = permissionIds.map(Number);
  console.log(updatedRole);

  if (ctx.state.CanUpdateRole) {
    ctx.session.flash = userModel.updateRole(ctx.db, updatedRole);
  }

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/admin" },
  });
};

export const removeRole = async (ctx) => {
  if (ctx.state.CanRemoveRole) {
    userModel.removeRole(ctx.db, ctx.params);
    ctx.session.flash = messages.REMOVE_ROLE_SUCCESS + " ID: " + ctx.params;
  }

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/admin" },
  });
};

export const removeRoleConfirmation = async (ctx) => {
  const role = userModel.getRoleById(ctx.db, ctx.params);

  return ctx.setResponse(
    await ctx.render(`roleRemoveForm.html`, {
      ...role,
    }),
    200,
    "text/html"
  );
};
