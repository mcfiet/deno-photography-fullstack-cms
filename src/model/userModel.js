import { getRolesByUserId } from "./roleModel.js";

export const getUserById = (db, id) => {
  const user = db.queryEntries(
    `
    SELECT user_id, username, email FROM users
    WHERE user_id = $id
    `,
    {
      $id: id,
    }
  );
  return user[0];
};

export const getUserWithPermissionsById = (db, id) => {
  const user = db.queryEntries(
    `
    SELECT user_id, username FROM users
    WHERE user_id = $id
    `,
    {
      $id: id,
    }
  )[0];

  user.roles = getRolesByUserId(db, id);

  user.roles.forEach((role) => {
    role.permissions = getPermissionNamesByRoleId(db, role.role_id);
  });
  return user;
};

export const getPermissions = (db) => {
  return db.queryEntries(
    `
      SELECT * FROM permissions
    `
  );
};

export const getPermissionNamesByRoleId = (db, id) => {
  return [
    ...db.query(
      `
      SELECT permission_name FROM roles_permissions
      JOIN permissions
      ON roles_permissions.fk_permission = permissions.permission_id
      WHERE fk_role = $id
    `,
      {
        $id: id,
      }
    ),
  ].map(([name]) => name);
};

export const getPermissionsByRoleId = (db, id) => {
  return [
    ...db.queryEntries(
      `
      SELECT permission_id, permission_name FROM roles_permissions
      JOIN permissions
      ON roles_permissions.fk_permission = permissions.permission_id
      WHERE fk_role = $id
    `,
      {
        $id: id,
      }
    ),
  ];
};

export const getUsers = (db) => {
  return db.queryEntries(
    `
    SELECT * from users
    `
  );
};

export const getClients = (db) => {
  return db.queryEntries(
    `
    SELECT * from users
    WHERE NOT EXISTS
    (SELECT *  
    FROM  users_roles
    WHERE users.user_id = users_roles.fk_user);
    `
  );
};

export const updateUser = (db, formData, passwordHash, userId, roleIds) => {
  db.query(
    `
    UPDATE users
    SET username = $username, 
    password = $password
    WHERE user_id = $user_id;
    `,
    {
      $username: formData.username,
      $password: passwordHash,
      $user_id: userId,
    }
  );

  db.query(
    `    
    DELETE FROM users_roles
    WHERE fk_user = $id;
    `,
    {
      $id: userId,
    }
  );
  roleIds.forEach((roleId) => {
    try {
      db.query(
        `
    INSERT INTO users_roles (fk_user, fk_role)
    VALUES ($userId, $roleId)
    `,
        {
          $roleId: roleId,
          $userId: userId,
        }
      );
    } catch (error) {
      console.log("Constraint schon vorhanden: " + error);
    }
  });
};

export const addUser = (db, formData, roleIds) => {
  try {
    db.query(
      `
    INSERT INTO users (username, password, email)
    VALUES ($name, $password, $email)
    `,
      {
        $name: formData.username,
        $password: formData.password,
        $email: formData.email,
      }
    );
  } catch (error) {
    console.log(error);
    errormessage = "Email bereits vergeben";
  }
  const userId = db.query(
    `
    SELECT last_insert_rowid()
    `
  )[0][0];
  roleIds.forEach((roleId) => {
    db.query(
      `
    INSERT INTO users_roles (fk_user, fk_role)
    VALUES ($userId, $roleId)
    `,
      {
        $userId: userId,
        $roleId: roleId,
      }
    );
  });
};

export const registerUser = (db, user) => {
  let errormessage = "";
  try {
    return db.queryEntries(
      `
    INSERT INTO users (username, password, email)
    VALUES ($name, $password, $email)
    `,
      {
        $name: user.username,
        $password: user.password,
        $email: user.email,
      }
    );
  } catch (error) {
    console.log(error);
    errormessage = "Email bereits vergeben";
  }
  return errormessage;
};

export const removeUser = (db, id) => {
  db.query(
    `
    DELETE FROM users
    WHERE user_id = $id;
    `,
    {
      $id: id,
    }
  );
  db.query(
    `
    
    DELETE FROM users_roles
    WHERE fk_user = $id;
    `,
    {
      $id: id,
    }
  );
};
