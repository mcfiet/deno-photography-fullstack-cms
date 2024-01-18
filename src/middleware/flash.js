export const getFlash = (ctx) => {
  ctx.state.flash = ctx.session.flash;
  ctx.session.flash = null;
  return ctx;
};

export const getFormErrors = (ctx) => {
  ctx.state.formErrors = ctx.session.formErrors;
  ctx.session.formErrors = null;
  return ctx;
};
