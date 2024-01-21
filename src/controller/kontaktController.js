import * as model from "../model/messageModel.js";
import * as formDataController from "../helper/formData.js";
import * as messages from "../helper/messages.js";
import * as csrf from "../helper/csrf.js";
import { getFormErrors } from "../helper/validation.js";

export const index = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  return ctx.setResponse(
    await ctx.render(`kontakt.html`, {
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};

export const addMessage = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }
  console.log(formData);
  ctx.state.formErrors = getFormErrors(formData);

  if (!Object.values(ctx.state.formErrors).some((el) => el !== undefined)) {
    model.addMessage(ctx.db, formData);
    ctx.session.flash = messages.INQUIRY_SEND_SUCCESS;
    return (ctx.redirect = new Response("", {
      status: 303,
      headers: { Location: `/` },
    }));
  } else {
    return ctx.setResponse(
      await ctx.render(`kontakt.html`, {
        csrf: ctx.session.csrf,
        formData,
      }),
      200,
      "text/html"
    );
  }
};
