import * as model from "./model.js";
import * as formDataController from "../framework/formData.js";
import * as albumDelete from "../framework/albumDelete.js";

export const get = async (ctx) => {
  const product = model.getProductByName(ctx.db, "Einzelbild");
  let cart;
  if (ctx.session.cart) {
    cart = ctx.session.cart;
  }

  ctx.response.body = await ctx.nunjucks.render("cart.html", {
    cart,
    product,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
