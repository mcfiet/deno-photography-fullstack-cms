import { encodeBase64 } from "https://deno.land/std@0.212.0/encoding/base64.ts";
export const generateToken = () => {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return encodeBase64(array);
};

export const getCsrf = (ctx) => {
  ctx.session.csrf = generateToken();
  return ctx;
};
