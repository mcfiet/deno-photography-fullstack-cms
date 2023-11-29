import * as path from "https://deno.land/std@0.152.0/path/posix.ts";
import * as mediaTypes from "https://deno.land/std@0.151.0/media_types/mod.ts";

export const serveStaticFile = async (ctx) => {
  const base = ctx.staticBase;
  let file;
  // https://nodejs.org/en/knowledge/file-system/security/introduction/#preventing-directory-traversal
  const fullPath = path.join(base, ctx.url.pathname);
  console.log("pathname", fullPath.indexOf(base));
  if (fullPath.indexOf(base) !== 0 || fullPath.indexOf("\0") !== -1) {
    ctx.response.status = 403;
    return ctx;
  }
  try {
    file = await Deno.open(fullPath, { read: true });
  } catch (_error) {
    return ctx;
  }
  const { ext } = path.parse(ctx.url.pathname);
  const contentType = mediaTypes.contentType(ext);

  if (contentType) {
    ctx.response.body = file.readable; // Use readable stream
    ctx.response.headers.set("Content-type", contentType);
    ctx.response.status = 200;
  } else {
    Deno.close(file.rid);
  }
  return ctx;
};
