let isLoggedIn = true;

export const get = async (ctx, site, status) => {
  ctx.response.body = await ctx.nunjucks.render(`${site}.html`, {
    isLoggedIn: isLoggedIn,
  });
  ctx.response.status = status;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
