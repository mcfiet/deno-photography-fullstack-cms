import * as imageValidation from "../framework/imageValidation.js";
import * as imageSaving from "../framework/imageSaving.js";
import * as model from "../notes/model.js";

let isLoggedIn = true;

export const login = async (ctx) => {
  const requestFormData = await ctx.request.formData();
  const formData = {
    username: requestFormData.get("username"),
    password: requestFormData.get("password"),
  };
  if (formData.username == "test" && formData.password == "test") {
    isLoggedIn = true;
  }

  if (isLoggedIn) {
    ctx.response.body = null;
    ctx.response.status = 303;
    ctx.response.headers.set("location", "/");
  } else {
    ctx.response.body = null;
    ctx.response.status = 303;
    ctx.response.headers.set("location", "/login");
  }

  return ctx;
};

export const admin = async (ctx) => {
  const formData = await ctx.request.formData();
  const upload = formData.get("upload");

  if (imageValidation.validateImage(upload) == "Validiert") {
    await imageSaving.saveImage(upload);
  } else {
    console.log(imageValidation.validateImage(upload));
  }

  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", "/");
  return ctx;
};

export const addImage = async (ctx, albumId) => {
  const formData = await ctx.request.formData();
  const upload = formData.get("upload");

  if (imageValidation.validateImage(upload) == "Validiert") {
    await imageSaving.createDir(albumId);
    await imageSaving.saveImage(ctx.db, upload, albumId);
  } else {
    console.log(imageValidation.validateImage(upload));
  }

  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", `/gallerie/${albumId}`);
  return ctx;
};

export const addAlbum = async (ctx) => {
  const formDataRequest = await ctx.request.formData();
  let category = 1;
  if (formDataRequest.get("category") == "Motocross") {
    category = 2;
  }

  const formData = {
    title: formDataRequest.get("title"),
    category,
  };

  console.log(formData);

  model.addAlbum(ctx.db, formData);

  ctx.response.body = null;
  ctx.response.status = 303;
  ctx.response.headers.set("location", `/gallerie`);
  return ctx;
};
