import * as albumHandler from "../framework/albumHandler.js";
import * as getProductsJs from "../model/productModel.js";
import * as getAlbumsJs from "../model/albumModel.js";
import * as imageValidation from "../framework/imageValidation.js";
import * as imageHandler from "../framework/imageHandler.js";
import { CHAR_0 } from "https://deno.land/std@0.152.0/path/_constants.ts";

export const add = async (ctx) => {
  const formData = await ctx.request.formData();
  const upload = formData.get("upload");
  const albumId = formData.get("album_id");
  if (imageValidation.validateImage(upload) == "Validiert") {
    await albumHandler.createDir(albumId);
    await imageHandler.saveImage(ctx.db, upload, albumId);
  } else {
    //console.log(imageValidation.validateImage(upload));
  }

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/fotos/${albumId}` },
  });
  return ctx;
};

export const removeConfirmation = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render(
    "imageDeleteConfirmation.html",
    {
      imageId: ctx.params,
      imageLink: getAlbumsJs.getImageById(ctx.db, ctx.params)
        .albums_images_link,
    }
  );
  ctx.response.status = 200;
  ctx.response.headers.set("content-type", "text/html");
  return ctx;
};

export const remove = (ctx) => {
  const albumId = getAlbumsJs.getAlbumIdByImageId(ctx.db, ctx.params);

  imageHandler.deleteImage(
    ctx.db,
    getAlbumsJs.getImageById(ctx.db, ctx.params)
  );

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/fotos/${albumId}` },
  });
  return ctx;
};

export const addToCart = (ctx) => {
  if (!ctx.session.cart) {
    ctx.session.cart = { images: [] };
    ctx.session.cart.bundlesUsed = [];
  }

  const imageId = parseInt(ctx.params);

  if (!isImageAlreadyInCart(ctx.session.cart, imageId)) {
    ctx.session.cart.images.push(getAlbumsJs.getImageById(ctx.db, imageId));
    updateCart(ctx);
  } else {
    //TODO Flash-Message: "Bild ist bereits im Warenkorb"
    console.log("Bild ist bereits im Warenkorb");
  }

  //console.log(ctx.session.cart);

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/fotos" },
  });
  return ctx;
};

export const removeFromCart = (ctx) => {
  const imageId = parseInt(ctx.params);
  ctx.session.cart.images = removeObjectById(ctx.session.cart.images, imageId);
  updateCart(ctx);
  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: "/cart" },
  });
  return ctx;
};

export function updateCart(ctx) {
  const bundles = getProductsJs.getBundleAmounts(ctx.db);
  const productPrice = getProductsJs.getProductByName(
    ctx.db,
    "Einzelbild"
  ).product_price;

  ctx.session.cart.totalPrice = 0;
  ctx.session.cart.singleImages = ctx.session.cart.images.length;
  ctx.session.cart.bundlesUsed = [];
  ctx.session.cart = checkBundles(ctx.session.cart, bundles, ctx.db);

  ctx.session.cart.totalPrice = ctx.session.cart.images.length * productPrice;

  let sumUsedBundlePrices = 0;
  ctx.session.cart.bundlesUsed.forEach((element) => {
    sumUsedBundlePrices += element.product_price;
  });
  ctx.session.cart.totalPriceWithBundles =
    sumUsedBundlePrices + ctx.session.cart.singleImages * productPrice;
}

export function isImageAlreadyInCart(cart, imageId) {
  let bool = false;
  if (cart.images.length > 0) {
    cart.images.forEach((element) => {
      if (element.image_id === imageId) {
        bool = true;
      }
    });
  }

  return bool;
}

// REKURSION OPTION 1: MIT FOR-SCHLEIFE

// Funktion zum Löschen eines Objekts anhand der ID
function removeObjectById(array, idToRemove) {
  return array.filter((obj) => obj.image_id !== idToRemove);
}

export function checkBundles(cart, sortetBundlesAsc, db) {
  for (let i = 0; i < sortetBundlesAsc.length; i++) {
    if (
      cart.singleImages >= sortetBundlesAsc[sortetBundlesAsc.length - 1 - i]
    ) {
      //console.log(cart.bundlesUsed);
      cart.bundlesUsed.push(
        getProductsJs.getBundleByBundleAmount(
          db,
          sortetBundlesAsc[sortetBundlesAsc.length - 1 - i]
        )
      );
      cart.singleImages = checkBundles(
        {
          singleImages:
            cart.singleImages -
            sortetBundlesAsc[sortetBundlesAsc.length - 1 - i],
          bundlesUsed: cart.bundlesUsed,
        },
        sortetBundlesAsc,
        db
      ).singleImages;
    }
  }
  return cart;
}
// REKURSION OPTION 2: OHNE FOR-SCHLEIFE

// export function checkBundles(cartLength, sortedBundlesDesc, i = 0) {
//   if (cartLength < sortedBundlesDesc[i]) {
//     i++;
//   }
//   if (i >= sortedBundlesDesc.length - 1) {
//     return cartLength;
//   }

//   if (cartLength - sortedBundlesDesc[i] < 0) {
//     i++;
//   }

//   if (cartLength > 0) {
//     cartLength = checkBundles(
//       cartLength - sortedBundlesDesc[i],
//       sortedBundlesDesc,
//       i
//     );
//   }
//   return cartLength;
// }
