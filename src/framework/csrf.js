import { encode as base64Encode } from "https://deno.land/std/encoding/base64.ts";

export const generateToken = () => {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64Encode(array);
};

export const getCsrf = (ctx) => {
  ctx.session.csrf = generateToken();
  return ctx;
};
