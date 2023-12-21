import * as controller from "./controller.js";
import * as controllerProducts from "./ctrl_Products.js";
import * as controllerFotos from "./ctrl_Fotos.js";
import * as controllerAlbum from "./ctrl_Album.js";
import * as controllerImage from "./ctrl_Image.js";
import * as controllerLogin from "./ctrl_Login.js";
import * as controllerCart from "./ctrl_Cart.js";

const isMatching = (pattern, method, ctx) => {
  return pattern.test(ctx.url) && ctx.request.method === method;
};

// const homePattern = new URLPattern({ pathname: "/" });

// const fotosPattern = new URLPattern({ pathname: "/fotos" });

// const albumPattern = new URLPattern({ pathname: "/fotos/:id" });
// const albumRemovePattern = new URLPattern({ pathname: "/album/remove/:id" });
// const albumAddPattern = new URLPattern({ pathname: "/album/add" });
// const albumUpdatePattern = new URLPattern({ pathname: "/album/update/:id" });

// const productsPattern = new URLPattern({ pathname: "/products" });
// const productRemovePattern = new URLPattern({ pathname: "/product/remove/:id" });
// const productAddPattern = new URLPattern({ pathname: "/product/add" });
// const productUpdatePattern = new URLPattern({ pathname: "/product/update/:id" });

// const ueberMichPattern = new URLPattern({ pathname: "/ueber-mich" });
// const kontaktPattern = new URLPattern({ pathname: "/kontakt" });
// const adminPattern = new URLPattern({ pathname: "/admin" });
// const loginPattern = new URLPattern({ pathname: "/login" });
// const logoutPattern = new URLPattern({ pathname: "/logout" });

// const imageRemovePattern = new URLPattern({ pathname: "/image/delete/:id" });
// const imageAddPattern = new URLPattern({ pathname: "/image/add" });
// const imageAddToCartPattern = new URLPattern({ pathname: "/image/addToCart" });
// const imageRemoveFromCartPattern = new URLPattern({ pathname: "/image/removeFromCart" });

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
router.get("/admin", [], controller.admin);
router.get("/kontakt", [], controller.kontakt);
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
