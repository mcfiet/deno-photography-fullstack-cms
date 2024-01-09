import * as model from "./model.js";
import * as formDataController from "../framework/formData.js";
import * as albumDelete from "../framework/albumDelete.js";

export const index = async (ctx) => {
  if (ctx.session.state.isLoggedIn) {
    ctx.response.body = await ctx.nunjucks.render(`admin.html`, {
      isLoggedIn: ctx.session.state.isLoggedIn,
      messages: model.getMessages(ctx.db),
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
