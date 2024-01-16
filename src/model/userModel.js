export const getUserById = (db, id) => {
  const user = db.queryEntries(
    `
    SELECT * FROM users
    WHERE user_id = $id
    `,
    {
      $id: id,
    }
  );
  return user[0];
};

export const getPermissionByUserId = (db, id) => {
  let permissions = getRolesByUserId(db, id);

  for (const permission of permissions) {
    permission.permissions = db.queryEntries(
      `
   SELECT permission_name FROM roles_permissions
JOIN permissions
ON roles_permissions.fk_permission = permissions.permission_id
WHERE fk_role = $id
    `,
      {
        $id: id,
      }
    );
  }
  return permissions;
};
export const getPermissionsByUserId = (db, id) => {
  let user = getUserById(db, id);

  user.roles = getPermissionByUserId(db, user.user_id);
  return permissions;
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

export const getUsers = (db) => {
  let users = db.queryEntries(
    `
    SELECT * from users
    `
  );
  return users;
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
export const addUser = (db, formData, passwordHash) => {
  return db.queryEntries(
    `
INSERT INTO users (username, password, fk_user_role)
VALUES ($username, $password, $role_id);
    `,
    {
      $username: formData.username,
      $password: passwordHash,
      $role_id: formData.user_role,
    }
  );
};
export const getRoles = (db) => {
  return db.queryEntries(
    `
    SELECT * from user_roles
    `
  );
};
