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
        $name: role.role_name,
        $id: role.role_id,
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
      $id: role.role_id,
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
          $roleId: role.role_id,
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
        $name: role.role_name,
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

export const getPermissionsByIds = (db, ids) => {
  const permissions = [];

  for (const id of ids) {
    permissions.push(
      db.queryEntries(
        `
        SELECT * FROM permissions
        WHERE permission_id = $id;
        `,
        {
          $id: id,
        }
      )[0]
    );
  }

  return permissions;
};
