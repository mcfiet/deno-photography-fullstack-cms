import * as model from "../model/messageModel.js";
import * as userModel from "../model/userModel.js";
import * as orderModel from "../model/orderModel.js";
import * as messageModel from "../model/messageModel.js";
import * as getRolesByUserIdJs from "../model/roleModel.js";
import * as csrf from "../helper/csrf.js";
import * as formDataController from "../helper/formData.js";

export const index = async (ctx) => {
  if (ctx.state.authenticated) {
    const users = userModel.getUsers(ctx.db);
    for (const user of users) {
      user.roles = getRolesByUserIdJs.getRolesByUserId(ctx.db, user.user_id);
    }
    const clients = userModel.getClients(ctx.db);
    const orders = orderModel.getOrders(ctx.db);
    return ctx.setResponse(
      await ctx.render(`admin.html`, {
        users,
        clients,
        orders,
        roles: getRolesByUserIdJs.getRoles(ctx.db),
        messages: model.getMessages(ctx.db),
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

export const deleteMessageForm = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  const message = messageModel.getMessageById(ctx.db, ctx.params);
  console.log(message);
  return ctx.setResponse(
    await ctx.render(`messageRemoveForm.html`, {
      csrf: ctx.session.csrf,
      ...message,
    }),
    200,
    "text/html"
  );
};

export const deleteMessage = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  if (ctx.state.CanRemoveMessage) {
    messageModel.removeMessageById(ctx.db, ctx.params);

    ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/admin" },
    });
  } else {
    return (ctx.response.status = 403);
  }
};
