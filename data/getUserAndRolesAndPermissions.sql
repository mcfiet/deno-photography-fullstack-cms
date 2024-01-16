SELECT * FROM roles_permissions
JOIN permissions
ON roles_permissions.fk_permission = permissions.permission_id
WHERE fk_role = 1
