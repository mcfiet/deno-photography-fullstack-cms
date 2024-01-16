import * as controller from "./controller/controller.js";
import * as controllerProducts from "./controller/productsController.js";
import * as controllerFotos from "./controller/fotosController.js";
import * as controllerAlbum from "./controller/albumController.js";
import * as controllerImage from "./controller/imageController.js";
import * as controllerLogin from "./controller/loginController.js";
import * as controllerAdmin from "./controller/adminController.js";
import * as controllerCart from "./controller/cartController.js";
import * as controllerKontakt from "./controller/kontaktController.js";
import * as model from "./model/messageModel.js";
import * as getUserByIdJs from "./model/userModel.js";

const isMatching = (pattern, method, ctx) => {
  return pattern.test(ctx.url) && ctx.request.method === method;
};
const hasPermission = (permission) => (ctx) => {
  console.log(ctx.state.user);
  if (!check(ctx.state.user, permission)) {
    ctx.response.body = "";
    ctx.response.status = 403;
    ctx.response.headers.set("content-type", "text/html");
  }
};
const check = (user, permission) => {
  let hasPermission = false;
  //console.log(user);
  if (user.permissions) {
    user.permissions.forEach((role) => {
      role.permissions.forEach((element) => {
        if (element.permission_name == permission) {
          hasPermission = true;
        }
      });
    });
  }
  return hasPermission;
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

export const addPermissions = (ctx) => {
  if (ctx.session.user) {
    ctx.state.CanRemoveAlbum = check(ctx.state.user, "remove album");
    ctx.state.CanAddAlbum = check(ctx.state.user, "add album");
    ctx.state.CanUpdateAlbum = check(ctx.state.user, "update album");

    ctx.state.CanRemoveImage = check(ctx.state.user, "remove image");
    ctx.state.CanAddImage = check(ctx.state.user, "add image");

    ctx.state.CanRemoveProduct = check(ctx.state.user, "remove product");
    ctx.state.CanAddProduct = check(ctx.state.user, "add product");
    ctx.state.CanUpdateProduct = check(ctx.state.user, "update product");

    ctx.state.CanRemoveUser = check(ctx.state.user, "remove user");
    ctx.state.CanAddUser = check(ctx.state.user, "add user");
    ctx.state.CanUpdateUser = check(ctx.state.user, "update user");
  }
  return ctx;
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
router.get("/user/add", hasPermission("add user"), controllerAdmin.addUserForm);
router.post("/user/add", hasPermission("add user"), controllerAdmin.addUser);
router.post("/addMessage", [], controllerKontakt.addMessage);
router.get("/kontakt", [], controllerKontakt.index);
router.get("/login", [], controllerLogin.get);
router.post("/login", [], controllerLogin.login);
router.get("/logout", [], controllerLogin.logout);
router.get(
  "/image/delete/:id",
  hasPermission("delete image"),
  controllerImage.removeConfirmation
);
router.post(
  "/image/delete/:id",
  hasPermission("delete image"),
  controllerImage.remove
);
router.post("/image/add", hasPermission("add image"), controllerImage.add);
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
    if (Object.values(ctx.session.user).some((el) => el !== undefined)) {
      //console.log(ctx.session.user);
      const user = getUserByIdJs.getUserById(ctx.db, ctx.session.user.user_id);
      user.permissions = getUserByIdJs.getPermissionByUserId(
        ctx.db,
        ctx.session.user.user_id
      );
      //console.log(ctx.state);
      ctx.state.user = user;
      ctx.state.authenticated = true;
      ctx = addPermissions(ctx);
      //console.log(ctx.state);
    }

    ctx.params = extractParams(match.pattern, ctx.url);
    if (ctx.response.status) {
      return ctx;
    }
    if (match.middleware.length > 0) {
      match.middleware(ctx);
      if (ctx.response.status) {
        return ctx;
      }
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
