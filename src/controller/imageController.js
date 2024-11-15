import * as albumHandler from "../helper/albumHandler.js";
import * as getProductsJs from "../model/productModel.js";
import * as albumModel from "../model/albumModel.js";
import * as imageValidation from "../helper/validation.js";
import * as imageHandler from "../helper/imageHandler.js";
import * as csrf from "../helper/csrf.js";
import * as formDataController from "../helper/formData.js";

export const add = async (ctx) => {
  const formData = await ctx.request.formData();
  const upload = formData.get("upload");
  const albumId = formData.get("album_id");
  const image_alt = formData.get("image_alt");
  if (imageValidation.validateImage(upload) == "Validiert") {
    await albumHandler.createDir(albumId);
    await imageHandler.saveImage(ctx.db, upload, albumId, image_alt);
  } else {
    ctx.session.flash = imageValidation.validateImage(upload);
  }

  ctx.redirect = new Response("", {
    status: 303,
    headers: { Location: `/fotos/${albumId}` },
  });
  return ctx;
};

export const removeForm = async (ctx) => {
  ctx.session.csrf = csrf.generateToken();

  return ctx.setResponse(
    await ctx.render(`imageRemoveForm.html`, {
      imageId: ctx.params,
      imageLink: albumModel.getImageById(ctx.db, ctx.params).albums_images_link,
      csrf: ctx.session.csrf,
    }),
    200,
    "text/html"
  );
};

export const remove = async (ctx) => {
  const formData = await formDataController.getEntries(ctx);

  if (ctx.session.csrf !== formData._csrf) {
    return (ctx.response.status = 403);
  }

  const albumId = albumModel.getAlbumIdByImageId(ctx.db, ctx.params);

  imageHandler.deleteImage(ctx.db, albumModel.getImageById(ctx.db, ctx.params));

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
    ctx.session.cart.images.push(albumModel.getImageById(ctx.db, imageId));
    updateCart(ctx);
  } else {
    //TODO Flash-Message: "Bild ist bereits im Warenkorb"
    ctx.session.flash = "Bild ist bereits im Warenkorb";
    console.log("Bild ist bereits im Warenkorb");
  }

  ctx.redirect = new Response("", {
    status: 303,
    headers: {
      Location: `/fotos/${albumModel.getAlbumIdByImageId(ctx.db, imageId)}`,
    },
  });
  return ctx;
};

export const removeFromCart = (ctx) => {
  const imageId = parseInt(ctx.params);
  ctx.session.cart.images = removeObjectById(ctx.session.cart.images, imageId);
  updateCart(ctx);
  ctx.redirect = new Response("", {
    status: 303,
    headers: {
      Location: `/fotos/${albumModel.getAlbumIdByImageId(ctx.db, imageId)}`,
    },
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
