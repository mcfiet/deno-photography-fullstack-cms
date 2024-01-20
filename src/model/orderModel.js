export const addOrder = (db, cart, user) => {
  let errormessage;
  db.query(
    `
    INSERT INTO orders (fk_user, totalPrice)
    VALUES ($userId, $totalPrice)
    `,
    {
      $userId: user.user_id,
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

export const getOrders = (db) => {
  return db.queryEntries(
    `
    SELECT * FROM orders
    `
  );
};
