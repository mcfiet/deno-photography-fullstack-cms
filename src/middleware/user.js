import * as userModel from "../model/userModel.js";

export const getUser = (ctx) => {
  if (ctx.session.user) {
    const user = createUser(ctx);
    ctx.state.user = user;
    ctx.state.authenticated = true;
    ctx = user.addPermissions(ctx);
  }
  return ctx;
};

export const createUser = (ctx) => {
  const user = userModel.getUserWithPermissionsById(
    ctx.db,
    ctx.session.user.user_id
  );
  return {
    ...user,
    check(permission) {
      let hasPermission = false;

      if (user.roles) {
        user.roles.forEach((role) => {
          role.permissions.forEach((element) => {
            if (element == permission) {
              hasPermission = true;
            }
          });
        });
      }
      return hasPermission;
    },
    checkRole(role) {
      let hasRole = false;
      user.roles.forEach((element) => {
        if (element.role_name == role) {
          hasRole = true;
        }
      });
      return hasRole;
    },
    addPermissions(ctx) {
      if (ctx.session.user) {
        ctx.state.CanRemoveAlbum = this.check("remove album");
        ctx.state.CanAddAlbum = this.check("add album");
        ctx.state.CanUpdateAlbum = this.check("update album");

        ctx.state.CanRemoveImage = this.check("remove image");
        ctx.state.CanAddImage = this.check("add image");

        ctx.state.CanRemoveProduct = this.check("remove product");
        ctx.state.CanAddProduct = this.check("add product");
        ctx.state.CanUpdateProduct = this.check("update product");

        ctx.state.CanRemoveUser = this.check("remove user");
        ctx.state.CanAddUser = this.check("add user");
        ctx.state.CanUpdateUser = this.check("update user");

        ctx.state.CanRemoveRole = this.check("remove role");
        ctx.state.CanAddRole = this.check("add role");
        ctx.state.CanUpdateRole = this.check("update role");
        ctx.state.CanRemoveMessage = this.check("remove message");
      }
      if (this.checkRole("admin")) {
        ctx.state.isAdmin = true;
      }
      return ctx;
    },
  };
};
