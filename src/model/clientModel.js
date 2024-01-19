export const getClients = (db) => {
  return db.queryEntries(
    `
    SELECT * from clients
    `
  );
};

export const addClient = (db, client) => {
  let errormessage;
  try {
    return db.queryEntries(
      `
    INSERT INTO clients (client_name, client_password, client_email)
    VALUES ($name, $password, $email)
    `,
      {
        $name: client.name,
        $password: client.password,
        $email: client.email,
      }
    );
  } catch (error) {
    console.log(error);
    errormessage = "Email bereits vergeben";
  }
  if (errormessage) {
    return errormessage;
  }
};
