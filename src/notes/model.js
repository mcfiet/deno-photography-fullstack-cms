export const getAlbums = (db) => {
  return db.queryEntries(`
  SELECT album_id, album_title, category_name FROM albums
JOIN categories 
  ON category_id = album_category
  `);
};

export const getAlbumById = (db, id) => {
  const album = db.queryEntries(
    `
  SELECT * FROM albums
WHERE album_id = $albumId
  `,
    {
      $albumId: id,
    }
  );
  return album[0];
};

export const updateAlbum = (db, formData, id) => {
  db.query(
    `
    UPDATE albums
    SET album_title = $albumName
    WHERE album_id = $id;
    `,
    {
      $id: id,
      $albumName: formData.albumName,
    }
  );
};

export const getAlbumCategories = (db) => {
  return db.queryEntries(`
  SELECT category_name FROM categories
  `);
};

export const getImageById = (db, imageId) => {
  const img = db.queryEntries(
    `
  SELECT * FROM albums_images
  WHERE image_id = $imageId
  `,
    {
      $imageId: imageId,
    }
  );

  return img[0];
};

export const deleteImageById = (db, imageId) => {
  const img = db.queryEntries(
    `
  DELETE FROM albums_images
  WHERE image_id = $imageId
  `,
    {
      $imageId: imageId,
    }
  );

  return img[0];
};

export const getAlbumIdByImageId = (db, imageId) => {
  const img = db.queryEntries(
    `
  SELECT fk_albums_id FROM albums_images
  WHERE image_id = $imageId
  `,
    {
      $imageId: imageId,
    }
  );

  return img[0].fk_albums_id;
};

export const getAlbumImagesById = (db, albumId) => {
  return db.queryEntries(
    `
  SELECT * FROM albums_images
WHERE fk_albums_id = $albumId
  `,
    {
      $albumId: albumId,
    }
  );
};

export const getAlbumNameById = (db, albumId) => {
  const value = db.queryEntries(
    `
  SELECT album_title FROM albums
WHERE album_id = $albumId
  `,
    {
      $albumId: albumId,
    }
  );
  return value[0].album_title;
};

export const saveAlbumImageById = (db, albumId, filename) => {
  return db.queryEntries(
    `
  INSERT INTO albums_images(fk_albums_id, albums_images_link)
VALUES ($albumId, $filename);
  `,
    {
      $albumId: albumId,
      $filename: filename,
    }
  );
};

export const addAlbum = (db, formData) => {
  return db.queryEntries(
    `
  INSERT INTO albums(album_title, album_category)
VALUES ($album_title, $albums_category);
  `,
    {
      $album_title: formData.title,
      $albums_category: formData.category,
    }
  );
};

export const deleteAlbum = (db, albumId) => {
  db.query(
    `
  DELETE FROM albums_images
WHERE fk_albums_id = $albumId;
  `,
    {
      $albumId: albumId,
    }
  );
  db.query(
    `
    DELETE FROM albums
WHERE album_id = $albumId;
  `,
    {
      $albumId: albumId,
    }
  );
};

export const getProducts = (db) => {
  return db.queryEntries(`
  SELECT * FROM products 
  WHERE product_bundleAmount is NULL;
  `);
};

export const getProductById = (db, id) => {
  const product = db.queryEntries(
    `
  SELECT * FROM products 
  WHERE product_id = $id;
  `,
    {
      $id: id,
    }
  );
  return product[0];
};
export const getProductByName = (db, name) => {
  const product = db.queryEntries(
    `
  SELECT * FROM products 
  WHERE product_name = $name;
  `,
    {
      $name: name,
    }
  );
  return product[0];
};

export const getBundles = (db) => {
  return db.queryEntries(`
  SELECT * FROM products 
  WHERE product_bundleAmount is NOT NULL;
  `);
};

export const getBundleByBundleAmount = (db, amount) => {
  const bundles = db.queryEntries(
    `
  SELECT * FROM products 
  WHERE product_bundleAmount is NOT NULL
  AND product_bundleAmount = $amount;
  `,
    {
      $amount: amount,
    }
  );
  return bundles[0];
};

export const getBundleAmounts = (db) => {
  const bundles = db.queryEntries(
    `
  SELECT product_bundleAmount FROM products 
  WHERE product_bundleAmount is NOT NULL
  `
  );
  return bundles.map((obj) => obj.product_bundleAmount);
};

export const addProduct = (db, formData) => {
  db.query(
    `INSERT INTO products (product_name, product_text, product_price, product_priceDes, product_bundleAmount)
    VALUES ($name, $text, $price, $priceDes, $bundleAmount);
    `,
    {
      $name: formData.name,
      $text: formData.text,
      $price: formData.price,
      $priceDes: formData.priceDes,
      $bundleAmount: formData.bundleAmount,
    }
  );
};

export const updateProduct = (db, formData, id) => {
  db.query(
    `
    UPDATE products
    SET product_name = $name,
    product_text = $text,
    product_price = $price,
    product_priceDes = $priceDes,
    product_bundleAmount = $bundleAmount
    WHERE product_id = $id;
    `,
    {
      $id: id,
      $name: formData.name,
      $text: formData.text,
      $price: formData.price,
      $priceDes: formData.priceDes,
      $bundleAmount: formData.bundleAmount,
    }
  );
};

export const deleteProduct = (db, id) => {
  db.query(
    `
    DELETE FROM products
    WHERE product_id = $id;
    `,
    {
      $id: id,
    }
  );
};

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

export const getUsers = (db) => {
  return db.queryEntries(`SELECT * FROM users`);
};

export const addMessage = (db, message) => {
  db.query(
    `INSERT INTO messages (sender_name, sender_email, message_subject, message_text)
VALUES ($senderName, $senderEmail, $messageSubject, $messageText)`,
    {
      $senderName: message.name,
      $senderEmail: message.email,
      $messageSubject: message.subject,
      $messageText: message.message,
    }
  );
};

export const getMessages = (db) => {
  return db.queryEntries(`SELECT * FROM messages`);
};
