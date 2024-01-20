export const getFlash = (ctx) => {
  ctx.state.flash = ctx.session.flash;
  ctx.session.flash = null;
  return ctx;
};
