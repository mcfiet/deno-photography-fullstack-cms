export const get = async (ctx, site, status) => {
  //console.log("Session User: ", ctx.session.user);

  ctx.response.body = await ctx.nunjucks.render(`${site}.html`, {});
  ctx.response.status = status;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const index = async (ctx) => {
  let cartAmount;
  //console.log(ctx.state);
  if (ctx.session.cart) {
    cartAmount = ctx.session.cart.images.length;
  }

  return ctx.setResponse(await ctx.render(`index.html`, {}), 200, "text/html");
};

export const ueberMich = async (ctx) => {
  return ctx.setResponse(
    await ctx.render(`ueber-mich.html`, {}),
    200,
    "text/html"
  );
};

export const error404 = async (ctx) => {
  return ctx.setResponse(
    await ctx.render(`error404.html`, {}),
    404,
    "text/html"
  );
};
