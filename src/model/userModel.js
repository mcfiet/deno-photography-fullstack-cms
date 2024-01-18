export const getUserById = (db, id) => {
  const user = db.queryEntries(
    `
    SELECT user_id, username FROM users
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

export const getPermissions = (db) => {
  return db.queryEntries(
    `
      SELECT * FROM permissions
    `
  );
};

export const getRolesByUserId = (db, id) => {
  return db.queryEntries(
    `
    SELECT role_id, role_name  FROM users_roles
    JOIN roles
    ON users_roles.fk_role = roles.role_id
    WHERE fk_user = $id
    `,
    {
      $id: id,
    }
  );
};

export const getRoles = (db) => {
  return db.queryEntries(
    `
    SELECT * from roles
    `
  );
};

export const getUsers = (db) => {
  return db.queryEntries(
    `
    SELECT * from users
    `
  );
};

export const updateUser = (db, formData, passwordHash, userId) => {
  return db.queryEntries(
    `
    UPDATE users
    SET username = $username, 
    password = $password,
    fk_user_role = $role_id
    WHERE user_id = $user_id;
    `,
    {
      $username: formData.username,
      $password: passwordHash,
      $role_id: formData.user_role,
      $user_id: userId,
    }
  );
};

export const addUser = (db, formData, passwordHash, roleIds) => {
  db.query(
    `
    INSERT INTO users (username, password)
    VALUES ($username, $password);
    `,
    {
      $username: formData.username,
      $password: passwordHash,
    }
  );
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

export const getRoleById = (db, id) => {
  return db.queryEntries(
    `
    SELECT * from roles
    WHERE role_id = $id
    `,
    {
      $id: id,
    }
  )[0];
};

export const updateRole = (db, role) => {
  let errorMessage;
  try {
    db.query(
      `
    UPDATE roles
    SET role_name = $name
    WHERE role_id = $id;
    `,
      {
        $name: role.name,
        $id: role.id,
      }
    )[0];
  } catch (error) {
    errorMessage = "Rollenname existiert schon";
    console.log("Rollenname existiert schon: " + error);
  }
  db.query(
    `    
    DELETE FROM roles_permissions
    WHERE fk_role = $id;
    `,
    {
      $id: role.id,
    }
  );

  role.permissionIds.forEach((permissionId) => {
    try {
      db.query(
        `
    INSERT INTO roles_permissions (fk_role, fk_permission)
    VALUES ($roleId, $permissionId)
    `,
        {
          $roleId: role.id,
          $permissionId: permissionId,
        }
      );
    } catch (error) {
      console.log("Constraint schon vorhanden: " + error);
    }
  });
  if (errorMessage) {
    return errorMessage;
  }
};

export const removeRole = (db, id) => {
  db.query(
    `    
    DELETE FROM roles_permissions
    WHERE fk_role = $id;
    `,
    {
      $id: id,
    }
  );

  db.query(
    `
    DELETE FROM roles
    WHERE role_id = $id;
    `,
    {
      $id: id,
    }
  );
};

export const addRole = (db, role) => {
  let errorMessage;
  try {
    db.query(
      `
    INSERT INTO roles (role_name)
    VALUES ($name)
    `,
      {
        $name: role.name,
      }
    )[0];
  } catch (error) {
    errorMessage = "Rollenname existiert schon";
    console.log("Rollenname existiert schon: " + error);
  }

  const roleId = db.query(
    `
    SELECT last_insert_rowid()
    `
  )[0][0];

  role.permissionIds.forEach((permissionId) => {
    try {
      db.query(
        `
    INSERT INTO roles_permissions (fk_role, fk_permission)
    VALUES ($roleId, $permissionId)
    `,
        {
          $roleId: roleId,
          $permissionId: permissionId,
        }
      );
    } catch (error) {
      console.log("Constraint schon vorhanden: " + error);
    }
  });
  if (errorMessage) {
    return errorMessage;
  }
};
