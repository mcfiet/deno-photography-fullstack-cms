import * as messages from "../framework/messages.js";
import * as productModel from "../model/productModel.js";
import * as formDataController from "../framework/formData.js";
import { getFormErrors } from "../framework/validation.js";
import * as csrf from "../framework/csrf.js";

export const get = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  return ctx.setResponse(
    await ctx.render(`preise.html`, {
      csrf: ctx.session.csrf,
      products: productModel.getProducts(ctx.db),
      bundles: productModel.getBundles(ctx.db),
    }),
    200,
    "text/html"
  );
};

export const removeConfirmation = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  const product = productModel.getProductById(ctx.db, ctx.params);
  return ctx.setResponse(
    await ctx.render(`productRemoveForm.html`, {
      csrf: ctx.session.csrf,

      item: product,
      id: ctx.params,
    }),
    200,
    "text/html"
  );
};

export const remove = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  productModel.deleteProduct(ctx.db, ctx.params);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/products` },
  });
  ctx.session.flash = messages.REMOVE_PRODUCT_SUCCESS;
  return ctx;
};

export const update = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  formData.product_id = ctx.params;
  ctx.state.formErrors = getFormErrors(formData);

  if (!Object.values(ctx.state.formErrors).some((el) => el !== undefined)) {
    if (ctx.state.CanUpdateUser) {
      productModel.updateProduct(ctx.db, formData);
      ctx.session.flash = messages.UPDATE_PRODUCT_SUCCESS;
      return (ctx.redirect = new Response("", {
        status: 303,
        headers: { Location: `/products` },
      }));
    } else {
      return (ctx.response.status = 403);
    }
  } else {
    ctx.session.csrf = csrf.generateToken();

    return ctx.setResponse(
      await ctx.render(`productErrorForm.html`, {
        csrf: ctx.session.csrf,
        ...formData,
      }),
      200,
      "text/html"
    );
  }
};

export const add = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  if (formData.bundleAmount == "") {
    formData.bundleAmount = null;
  }
  ctx.state.formErrors = getFormErrors(formData);

  if (!Object.values(ctx.state.formErrors).some((el) => el !== undefined)) {
    if (ctx.state.CanAddUser) {
      productModel.addProduct(ctx.db, formData);
      ctx.session.flash = messages.ADD_PRODUCT_SUCCESS;
      return (ctx.redirect = new Response("", {
        status: 303,
        headers: { Location: `/products` },
      }));
    } else {
      return (ctx.response.status = 403);
    }
  } else {
    ctx.session.csrf = csrf.generateToken();

    return ctx.setResponse(
      await ctx.render(`productErrorForm.html`, {
        csrf: ctx.session.csrf,
        ...formData,
      }),
      200,
      "text/html"
    );
  }
};
