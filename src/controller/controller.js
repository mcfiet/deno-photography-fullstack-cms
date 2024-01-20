export const get = async (ctx, site, status) => {
  ctx.response.body = await ctx.nunjucks.render(`${site}.html`, {});
  ctx.response.status = status;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const index = async (ctx) => {
  let cartAmount;
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

export const error403 = async (ctx) => {
  return ctx.setResponse(
    await ctx.render(`error403.html`, {}),
    500,
    "text/html"
  );
};

export const error500 = async (ctx) => {
  return ctx.setResponse(
    await ctx.render(`error500.html`, {}),
    500,
    "text/html"
  );
};
