import * as model from "../model/messageModel.js";
import * as getProductsJs from "../model/productModel.js";
import * as formDataController from "../framework/formData.js";
import * as albumDelete from "../framework/albumHandler.js";

export const get = async (ctx) => {
  const product = getProductsJs.getProductByName(ctx.db, "Einzelbild");
  let cart;
  if (ctx.session.cart) {
    cart = ctx.session.cart;
  }
  let cartAmount;
  if (ctx.session.cart) {
    cartAmount = ctx.session.cart.images.length;
  }
  ctx.response.body = await ctx.nunjucks.render("cart.html", {
    cartAmount,
    cart,
    product,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
