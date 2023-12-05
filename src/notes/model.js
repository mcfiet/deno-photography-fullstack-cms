export const getAlbums = (db) => {
  return db.queryEntries(`
  SELECT album_id, album_title, category_name FROM albums
JOIN categories 
  ON category_id = album_category
  `);
};

export const getAlbumCategories = (db) => {
  return db.queryEntries(`
  SELECT category_name FROM categories
  `);
};

export const getAlbumImagesById = (db, albumId) => {
  return db.queryEntries(
    `
  SELECT * FROM albums_images
WHERE fk_albums_id = $albumId
  `,
    {
      $albumId: albumId,
    },
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
    },
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
    },
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
    },
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
    },
  );
  db.query(
    `
    DELETE FROM albums
WHERE album_id = $albumId;
  `,
    {
      $albumId: albumId,
    },
  );
};

export const getProducts = (db) => {
  return db.queryEntries(`
  SELECT * FROM products 
  WHERE product_bundleAmount is NULL;
  `);
};

export const getBundles = (db) => {
  return db.queryEntries(`
  SELECT * FROM products 
  WHERE product_bundleAmount is NOT NULL;
  `);
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
    },
  );
};
export const updateProduct = (db, formData) => {
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
      $id: formData.id,
      $name: formData.name,
      $text: formData.text,
      $price: formData.price,
      $priceDes: formData.priceDes,
      $bundleAmount: formData.bundleAmount,
    },
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
    },
  );
};
