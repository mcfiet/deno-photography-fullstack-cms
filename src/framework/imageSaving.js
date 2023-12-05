import * as mediaTypes from "https://deno.land/std/media_types/mod.ts";
import * as path from "https://deno.land/std@0.152.0/path/posix.ts";
import * as model from "../notes/model.js";

async function generateFilename(file, albumId) {
  //const files = Deno.readDir(Deno.cwd() + "./public");
  let filenamePath = path.join(
    `upload/${albumId}`,
    "image-" + (await getHighestNumberFromDir(albumId) + 1) +
      "." + mediaTypes.extension(file.type),
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

async function checkDir(albumId) {
  for await (const dirEntry of Deno.readDir("public/upload")) {
    if (!dirEntry.isFile && dirEntry.name == albumId) {
      return true;
    }
  }
  return false;
}

export async function createDir(albumId) {
  console.log(await checkDir(albumId));
  if (!await checkDir(albumId)) {
    await Deno.mkdir(`public/upload/${albumId}`);
  } else {
    console.log("Ordner für Album existiert schon");
  }
}

export async function saveImage(db, upload, albumId) {
  const filename = await generateFilename(upload, albumId);
  //console.log("Filename: ", filename);

  console.log(filename);
  const destFile = await Deno.open(
    path.join(Deno.cwd(), "public", filename),
    {
      create: true,
      write: true,
      truncate: true,
    },
  );
  await upload.stream().pipeTo(destFile.writable);
  model.saveAlbumImageById(db, albumId, filename);
}
