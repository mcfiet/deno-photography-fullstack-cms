import * as controller from "./controller/controller.js";
import * as productsController from "./controller/productsController.js";
import * as fotosController from "./controller/fotosController.js";
import * as albumController from "./controller/albumController.js";
import * as imageController from "./controller/imageController.js";
import * as loginController from "./controller/loginController.js";
import * as adminController from "./controller/adminController.js";
import * as roleController from "./controller/roleController.js";
import * as userController from "./controller/userController.js";
import * as cartController from "./controller/cartController.js";
import * as kontaktController from "./controller/kontaktController.js";

export function extractParams(pattern, url) {
  const match = pattern.exec(url);
  if (match) {
    return match.pathname.groups.id;
  }
}

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

const checkRole = (role) => (ctx) => {
  if (!ctx.state.user || !ctx.state.user.checkRole(role)) {
    ctx.response.body = "";
    ctx.response.status = 403;
    ctx.response.headers.set("content-type", "text/html");
  }
  return ctx;
};

export const router = createRouter();
router.get("/", [], controller.index);
router.get("/fotos", [], fotosController.get);
router.get("/fotos/:id", [], albumController.get);
router.get(
  "/album/remove/:id",
  hasPermission("remove album"),
  albumController.removeForm
);
router.post(
  "/album/remove/:id",
  hasPermission("remove album"),
  albumController.remove
);
router.post("/album/add", hasPermission("add album"), albumController.add);
router.post(
  "/album/update/:id",
  hasPermission("update album"),
  albumController.update
);
router.get("/products", [], productsController.get);
router.get(
  "/product/remove/:id",
  hasPermission("remove product"),
  productsController.removeConfirmation
);
router.post(
  "/product/remove/:id",
  hasPermission("remove product"),
  productsController.remove
);
router.post(
  "/product/add",
  hasPermission("add product"),
  productsController.add
);
router.post(
  "/product/update/:id",
  hasPermission("update product"),
  productsController.update
);
router.get("/ueber-mich", [], controller.ueberMich);
router.get("/admin", checkRole("admin"), adminController.index);
router.get(
  "/user/edit/:id",
  hasPermission("update user"),
  userController.editUser
);
router.post(
  "/user/edit/:id",
  hasPermission("update user"),
  userController.saveUser
);
router.get(
  "/user/remove/:id",
  hasPermission("remove user"),
  userController.removeForm
);
router.post(
  "/user/remove/:id",
  hasPermission("remove user"),
  userController.remove
);
router.get("/user/add", hasPermission("add user"), userController.addUserForm);
router.post("/user/add", hasPermission("add user"), userController.addUser);
router.post("/addMessage", [], kontaktController.addMessage);
router.get("/kontakt", [], kontaktController.index);

router.get(
  "/image/remove/:id",
  hasPermission("remove image"),
  imageController.removeForm
);
router.post(
  "/image/remove/:id",
  hasPermission("remove image"),
  imageController.remove
);
router.post("/image/add", hasPermission("add image"), imageController.add);
router.get("/image/addToCart/:id", [], imageController.addToCart);
router.get("/image/removeFromCart/:id", [], imageController.removeFromCart);
router.get("/cart", [], cartController.get);
router.get("/order", [], cartController.orderForm);
router.post("/order", [], cartController.order);
router.get("/role/add", hasPermission("add role"), roleController.addForm);
router.post("/role/add", hasPermission("add role"), roleController.add);
router.get("/role/edit/:id", hasPermission("update role"), roleController.edit);
router.post(
  "/role/edit/:id",
  hasPermission("update role"),
  roleController.save
);
router.get(
  "/role/remove/:id",
  hasPermission("remove role"),
  roleController.removeForm
);
router.post(
  "/role/remove/:id",
  hasPermission("remove role"),
  roleController.remove
);
router.get("/register", [], loginController.registerForm);
router.post("/register", [], loginController.register);
router.get("/login", [], loginController.get);
router.post("/login", [], loginController.login);
router.get("/logout", [], loginController.logout);
router.get(
  "/message/remove/:id",
  hasPermission("remove message"),
  adminController.deleteMessageForm
);
router.post(
  "/message/remove/:id",
  hasPermission("remove message"),
  adminController.deleteMessage
);

router.get("/datenschutz", [], controller.datenschutz);
router.get("/impressum", [], controller.impressum);
router.get("/dokumentation", [], controller.dokumentation);

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
  const routes = [];

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
