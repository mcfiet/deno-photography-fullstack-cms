import * as model from "../model/messageModel.js";
import * as formDataController from "../framework/formData.js";
import * as messages from "../framework/messages.js";

export const index = async (ctx) => {
  return ctx.setResponse(
    await ctx.render(`kontakt.html`, {}),
    200,
    "text/html"
  );
};
export const addMessage = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);
  //console.log(formData);
  model.addMessage(ctx.db, formData);
  ctx.session.flash = messages.INQUIRY_SEND_SUCCESS;
  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/` },
  });
  return ctx;
};
