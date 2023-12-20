import { encode as base64Encode } from "https://deno.land/std/encoding/base64.ts";

const SESSION_KEY = "my_app.session";
const MAX_AGE = 60 * 60 * 1000; // one hour

export const createSessionStore = () => {
  const sessionStore = new Map();
  return {
    get(key) {
      const data = sessionStore.get(key);
      if (!data) {
        return;
      }
      return data.maxAge < Date.now() ? this.destroy(key) : data.session;
    },
    set(key, session, maxAge) {
      sessionStore.set(key, {
        session,
        maxAge: Date.now() + maxAge,
      });
    },
    destroy(key) {
      sessionStore.delete(key);
    },
  };
};

export const createId = () => {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64Encode(array);
};

export const getSession = (ctx) => {
  // Get Session
  ctx.sessionId = ctx.cookies.get(SESSION_KEY);

  ctx.session = ctx.sessionStore.get(ctx.sessionId) ?? {
    user: {},
    state: { isLoggedIn: null },
  };
  return ctx;
};

export const setSession = (ctx) => {
  if (Object.values(ctx.session).some((el) => el !== undefined)) {
    ctx.sessionId = ctx.sessionId ?? createId();
    ctx.sessionStore.set(ctx.sessionId, ctx.session, MAX_AGE);
    const maxAge = new Date(Date.now() + MAX_AGE);
    ctx.cookies.set(SESSION_KEY, ctx.sessionId, {
      expires: maxAge,
      httpOnly: true,
      overwrite: true,
    });
  } else {
    ctx.sessionStore.destroy(ctx.sessionId);
    ctx.cookies.delete(SESSION_KEY);
  }
  return ctx;
};
