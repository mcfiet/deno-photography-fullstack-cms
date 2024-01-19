import * as getProductsJs from "../model/productModel.js";
import * as orderModel from "../model/orderModel.js";
import * as csfr from "../framework/csrf.js";

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

export const orderForm = async (ctx) => {
  const product = getProductsJs.getProductByName(ctx.db, "Einzelbild");

  let cart;
  if (ctx.session.cart) {
    cart = ctx.session.cart;
  }

  ctx.session.csrf = csfr.generateToken();
  if (!ctx.session.client) {
    return ctx.setResponse(
      await ctx.render(`orderForm.html`, { csrf: ctx.session.csrf }),
      200,
      "text/html"
    );
  }

  return ctx.setResponse(
    await ctx.render(`orderSummary.html`, {
      csrf: ctx.session.csrf,
      client: ctx.session.client,
      cart: ctx.session.cart,
      product,
    }),
    200,
    "text/html"
  );
};

export const order = async (ctx) => {
  let cart;
  if (ctx.session.cart) {
    cart = ctx.session.cart;
  }
  if (!ctx.session.client) {
    return ctx.setResponse(
      await ctx.render(`orderForm.html`, { csrf: ctx.session.csrf }),
      200,
      "text/html"
    );
  }
  console.log(cart);
  console.log(ctx.session.client);

  orderModel.addOrder(ctx.db, cart, ctx.session.client);
  ctx.session.cart = undefined;
  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/" },
  });
  return ctx;
};
