import * as imageSaving from "./imageHandler.js";

export async function deleteAlbum(albumId) {
  if (await imageSaving.checkDir(albumId)) {
    await Deno.remove(`public/upload/${albumId}`, { recursive: true });
  }
}
