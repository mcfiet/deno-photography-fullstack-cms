export const addOrder = (db, cart, client) => {
  let errormessage;

  db.queryEntries(
    `
    INSERT INTO orders (fk_client, totalPrice)
    VALUES ($clientId, $totalPrice)
    `,
    {
      $clientId: client.client_id,
      $totalPrice: cart.totalPriceWithBundles,
    }
  );
  const orderId = db.query(
    `
    SELECT last_insert_rowid()
    `
  )[0][0];

  cart.images.forEach((image) => {
    try {
      db.queryEntries(
        `
    INSERT INTO orders_images (fk_order, fk_image)
    VALUES ($orderId, $imageId)
    `,
        {
          $orderId: orderId,
          $imageId: image.image_id,
        }
      );
    } catch (error) {
      console.log(error);
    }
  });

  if (errormessage) {
    return errormessage;
  }
};
