import { createContext } from "./context.js";

const runMiddleware = async (pipeline, ctx) => {
  try {
    ctx = await pipe(...pipeline)(ctx);
  } catch (error) {
    ctx.error = error;
    console.log(error);
    ctx.response.status = ctx.response.status ?? 500;
  }
  return ctx;
};

const extractResponse = (ctx) => {
  ctx.response.status = ctx.response.status ?? 404;

  return new Response(ctx.response.body, {
    status: ctx.response.status,
    headers: ctx.response.headers,
  });
};

const _callback = (pipeline, extra_context) => {
  return async (request) => {
    let ctx = createContext(request, extra_context);
    ctx = await runMiddleware(pipeline, ctx);
    if (ctx.redirect) {
      return ctx.redirect;
    }

    if (!ctx.response.body && ctx.response.status == 403) {
      ctx = await controller.error403(ctx);
    }
    if (!ctx.response.body && ctx.response.status == 500) {
      ctx = await controller.error500(ctx);
    }

    ctx.response.status = ctx.response.status ?? 404;

    if (!ctx.response.body && ctx.response.status == 404) {
      ctx = await controller.error404(ctx);
    }
    return extractResponse(ctx);
  };
};

const pipe =
  (...funcs) =>
  (arg) =>
    funcs.reduce(async (state, func) => func(await state), arg);

export const createApp = () => {
  let pipeline = [];
  return {
    context: {},
    useMiddelware(_pipeline) {
      pipeline = _pipeline;
    },
    use(middleware) {
      pipeline.push(middleware);
    },
    callback() {
      return _callback(pipeline, this.context);
    },
  };
};
