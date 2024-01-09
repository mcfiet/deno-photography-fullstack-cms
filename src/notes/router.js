import * as controller from "./controller.js";
import * as controllerProducts from "./ctrl_Products.js";
import * as controllerFotos from "./ctrl_Fotos.js";
import * as controllerAlbum from "./ctrl_Album.js";
import * as controllerImage from "./ctrl_Image.js";
import * as controllerLogin from "./ctrl_Login.js";
import * as controllerAdmin from "./ctrl_Admin.js";
import * as controllerCart from "./ctrl_Cart.js";
import * as controllerKontakt from "./ctrl_Kontakt.js";

const isMatching = (pattern, method, ctx) => {
  return pattern.test(ctx.url) && ctx.request.method === method;
};

export const router = createRouter();
router.get("/", [], controller.index);
router.get("/fotos", [], controllerFotos.get);
router.get("/fotos/:id", [], controllerAlbum.get);
router.get("/album/remove/:id", [], controllerAlbum.removeConfirmation);
router.post("/album/remove/:id", [], controllerAlbum.remove);
router.post("/album/add", [], controllerAlbum.add);
router.post("/album/update/:id", [], controllerAlbum.update);
router.get("/products", [], controllerProducts.get);
router.get("/product/remove/:id", [], controllerProducts.removeConfirmation);
router.post("/product/remove/:id", [], controllerProducts.remove);
router.post("/product/add", [], controllerProducts.add);
router.post("/product/update/:id", [], controllerProducts.update);
router.get("/ueber-mich", [], controller.ueberMich);
router.get("/admin", [], controllerAdmin.index);
router.post("/addMessage", [], controllerKontakt.addMessage);
router.get("/kontakt", [], controllerKontakt.index);
router.get("/login", [], controllerLogin.get);
router.post("/login", [], controllerLogin.login);
router.get("/logout", [], controllerLogin.logout);
router.get("/image/delete/:id", [], controllerImage.removeConfirmation);
router.post("/image/delete/:id", [], controllerImage.remove);
router.post("/image/add", [], controllerImage.add);
router.get("/image/addToCart/:id", [], controllerImage.addToCart);
router.get("/image/removeFromCart/:id", [], controllerImage.removeFromCart);
router.get("/cart", [], controllerCart.get);

const runRouter = (routes) => async (ctx) => {
  if (ctx.response.status) {
    return ctx;
  }
  const match = routes.find((route) =>
    isMatching(route.pattern, route.method, ctx)
  );

  if (match) {
    ctx.params = extractParams(match.pattern, ctx.url);
    if (ctx.response.status) {
      return ctx;
    }

    return await match.controller(ctx);
  }
  return ctx;
};

export function createRouter() {
  let routes = [];

  function addRouter(method, pathname, middleware, controller) {
    routes.push({
      method,
      pathname,
      pattern: new URLPattern({ pathname: pathname }),
      controller,
      middleware,
    });
  }
  return {
    routes() {
      return runRouter(routes);
    },
    get(pathname, middleware, controller) {
      addRouter("GET", pathname, middleware, controller);
    },
    post(pathname, middleware, controller) {
      addRouter("POST", pathname, middleware, controller);
    },
  };
}

export function extractParams(pattern, url) {
  const match = pattern.exec(url);
  if (match) {
    return match.pathname.groups.id;
  }
}
