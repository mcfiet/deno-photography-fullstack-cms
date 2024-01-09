export const get = async (ctx, site, status) => {
  //console.log("Session User: ", ctx.session.user);

  ctx.response.body = await ctx.nunjucks.render(`${site}.html`, {
    isLoggedIn: ctx.session.state.isLoggedIn,
  });
  ctx.response.status = status;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const index = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render(`index.html`, {
    isLoggedIn: ctx.session.state.isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const ueberMich = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render(`ueber-mich.html`, {
    isLoggedIn: ctx.session.state.isLoggedIn,
  });
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const error404 = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render(`error404.html`, {
    isLoggedIn: ctx.session.state.isLoggedIn,
  });
  ctx.response.status = 404;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};
