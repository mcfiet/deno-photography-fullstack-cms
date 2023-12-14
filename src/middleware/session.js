import { encode as base64Encode } from "https://deno.land/std/encoding/base64.ts";

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
