import * as getProductsJs from "../model/productModel.js";

export const get = async (ctx) => {
  const product = getProductsJs.getProductByName(ctx.db, "Einzelbild");
  let cart;
  if (ctx.session.cart) {
    cart = ctx.session.cart;
  }

  return ctx.setResponse(
    await ctx.render(`cart.html`, {
      cart,
      product,
    }),
    200,
    "text/html"
  );
};
