import * as getProductsJs from "../model/productModel.js";
import * as orderModel from "../model/orderModel.js";
import * as csrf from "../helper/csrf.js";

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

  if (ctx.session.user) {
    return ctx.setResponse(
      await ctx.render(`orderSummary.html`, {
        client: ctx.session.client,
        cart: ctx.session.cart,
        product,
      }),
      200,
      "text/html"
    );
  } else {
    return ctx.setResponse(
      await ctx.render(`orderForm.html`, { csrf: ctx.session.csrf }),
      200,
      "text/html"
    );
  }
};

export const order = async (ctx) => {
  let cart;
  if (ctx.session.cart) {
    cart = ctx.session.cart;
  }
  if (ctx.state.user) {
    orderModel.addOrder(ctx.db, cart, ctx.state.user);
    ctx.session.cart = undefined;
    return (ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: "/" },
    }));
  } else {
    return ctx.setResponse(
      await ctx.render(`orderForm.html`, { csrf: ctx.session.csrf }),
      200,
      "text/html"
    );
  }
};
