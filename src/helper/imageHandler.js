import * as mediaTypes from "https://deno.land/std/media_types/mod.ts";
import * as path from "https://deno.land/std@0.152.0/path/posix.ts";
import * as model from "../model/messageModel.js";
import * as albumModel from "../model/albumModel.js";

async function generateFilename(file, albumId) {
  //const files = Deno.readDir(Deno.cwd() + "./public");
  let filenamePath = path.join(
    `upload/${albumId}`,
    crypto.randomUUID() + "." + mediaTypes.extension(file.type)
  );

  return filenamePath;
}

async function getHighestNumberFromDir(albumId) {
  let number = 0;
  let highestNumber = 0;
  for await (const dirEntry of Deno.readDir(`public/upload/${albumId}`)) {
    number = dirEntry.name.split(".");
    number = number[0].split("-");
    number = parseInt(number[number.length - 1]);
    if (number > highestNumber) {
      highestNumber = number;
    }
  }
  return highestNumber;
}

export async function saveImage(db, upload, albumId, image_alt) {
  const filename = await generateFilename(upload, albumId);

  const destFile = await Deno.open(path.join(Deno.cwd(), "public", filename), {
    create: true,
    write: true,
    truncate: true,
  });
  await upload.stream().pipeTo(destFile.writable);
  albumModel.saveAlbumImageById(db, albumId, filename, image_alt);
}

export async function deleteImage(db, image) {
  await Deno.remove(`public/${image.albums_images_link}`);
  albumModel.deleteImageById(db, image.image_id);
}
