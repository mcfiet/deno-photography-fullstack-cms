export const get = async (ctx, site, status) => {
  console.log("Session User: ", ctx.session.user);

  ctx.response.body = await ctx.nunjucks.render(`${site}.html`, {
    isLoggedIn: ctx.session.state.isLoggedIn,
  });
  ctx.response.status = status;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
