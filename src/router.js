import * as controller from "./controller/controller.js";
import * as controllerProducts from "./controller/productsController.js";
import * as controllerFotos from "./controller/fotosController.js";
import * as controllerAlbum from "./controller/albumController.js";
import * as controllerImage from "./controller/imageController.js";
import * as controllerLogin from "./controller/loginController.js";
import * as controllerAdmin from "./controller/adminController.js";
import * as controllerCart from "./controller/cartController.js";
import * as controllerKontakt from "./controller/kontaktController.js";

const isMatching = (pattern, method, ctx) => {
  return pattern.test(ctx.url) && ctx.request.method === method;
};
const hasPermission = (permission) => (ctx) => {
  if (!ctx.state.user || !ctx.state.user.check(permission)) {
    ctx.response.body = "";
    ctx.response.status = 403;
    ctx.response.headers.set("content-type", "text/html");
  }
  return ctx;
};
const checkRole = (user, role) => {
  let hasRole = false;
  if (user.permissions) {
    user.permissions.forEach((element) => {
      if (element.role_name == role) {
        hasRole = true;
      }
    });
  }
  return hasRole;
};

export const router = createRouter();
router.get("/", [], controller.index);
router.get("/fotos", [], controllerFotos.get);
router.get("/fotos/:id", [], controllerAlbum.get);
router.get(
  "/album/remove/:id",
  hasPermission("remove album"),
  controllerAlbum.removeConfirmation
);
router.post(
  "/album/remove/:id",
  hasPermission("remove album"),
  controllerAlbum.remove
);
router.post("/album/add", hasPermission("add album"), controllerAlbum.add);
router.post(
  "/album/update/:id",
  hasPermission("update album"),
  controllerAlbum.update
);
router.get("/products", [], controllerProducts.get);
router.get(
  "/product/remove/:id",
  hasPermission("remove product"),
  controllerProducts.removeConfirmation
);
router.post(
  "/product/remove/:id",
  hasPermission("remove product"),
  controllerProducts.remove
);
router.post(
  "/product/add",
  hasPermission("add product"),
  controllerProducts.add
);
router.post(
  "/product/update/:id",
  hasPermission("update product"),
  controllerProducts.update
);
router.get("/ueber-mich", [], controller.ueberMich);
router.get("/admin", [], controllerAdmin.index);
router.get(
  "/user/edit/:id",
  hasPermission("update user"),
  controllerAdmin.editUser
);
router.post(
  "/user/edit/:id",
  hasPermission("update user"),
  controllerAdmin.saveUser
);
router.get(
  "/user/remove/:id",
  hasPermission("remove user"),
  controllerAdmin.removeUserConfirmation
);
router.post(
  "/user/remove/:id",
  hasPermission("remove user"),
  controllerAdmin.removeUser
);
router.get("/user/add", hasPermission("add user"), controllerAdmin.addUserForm);
router.post("/user/add", hasPermission("add user"), controllerAdmin.addUser);
router.post("/addMessage", [], controllerKontakt.addMessage);
router.get("/kontakt", [], controllerKontakt.index);
router.get("/login", [], controllerLogin.get);
router.post("/login", [], controllerLogin.login);
router.get("/logout", [], controllerLogin.logout);
router.get(
  "/image/remove/:id",
  hasPermission("remove image"),
  controllerImage.removeConfirmation
);
router.post(
  "/image/remove/:id",
  hasPermission("remove image"),
  controllerImage.remove
);
router.post("/image/add", hasPermission("add image"), controllerImage.add);
router.get("/image/addToCart/:id", [], controllerImage.addToCart);
router.get("/image/removeFromCart/:id", [], controllerImage.removeFromCart);
router.get("/cart", [], controllerCart.get);
router.get("/role/add", hasPermission("add role"), controllerAdmin.addRoleForm);
router.post("/role/add", hasPermission("add role"), controllerAdmin.addRole);
router.get(
  "/role/edit/:id",
  hasPermission("update role"),
  controllerAdmin.editRole
);
router.post(
  "/role/edit/:id",
  hasPermission("update role"),
  controllerAdmin.saveRole
);
router.get(
  "/role/remove/:id",
  hasPermission("remove role"),
  controllerAdmin.removeRoleConfirmation
);
router.post(
  "/role/remove/:id",
  hasPermission("remove role"),
  controllerAdmin.removeRole
);

const runRouter = (routes) => async (ctx) => {
  if (ctx.response.status) {
    return ctx;
  }
  const route = routes.find((route) =>
    isMatching(route.pattern, route.method, ctx)
  );

  if (route) {
    ctx.params = extractParams(route.pattern, ctx.url);
    if (ctx.response.status) {
      return ctx;
    }
    if (route.middleware.length > 0) {
      ctx = route.middleware(ctx);
      if (ctx.response.status) {
        return ctx;
      }
    }

    return await route.controller(ctx);
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
