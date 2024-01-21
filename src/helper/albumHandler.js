export async function deleteAlbum(albumId) {
  if (await checkDir(albumId)) {
    await Deno.remove(`public/upload/${albumId}`, { recursive: true });
  }
}

export async function checkDir(albumId) {
  for await (const dirEntry of Deno.readDir("public/upload")) {
    if (!dirEntry.isFile && dirEntry.name == albumId) {
      return true;
    }
  }
  return false;
}

export async function createDir(albumId) {
  if (!(await checkDir(albumId))) {
    await Deno.mkdir(`public/upload/${albumId}`);
  } else {
    console.log("Ordner für Album existiert schon");
  }
}
