import * as model from "../model/messageModel.js";
import * as formDataController from "../framework/formData.js";

export const index = async (ctx) => {
  let cartAmount;
  if (ctx.session.cart) {
    cartAmount = ctx.session.cart.images.length;
  }
  ctx.response.body = await ctx.nunjucks.render(`kontakt.html`, {
    cartAmount,
    isLoggedIn: ctx.session.state.isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
export const addMessage = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  //console.log(formData);
  model.addMessage(ctx.db, formData);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/kontakt` },
  });
  return ctx;
};
