/**
 * Get all data with added ids.
 * @param {Array[Record<string, any>]} data
 * @returns {Array[Record<string, any>]}
 */
export const getProducts = (db) => {
  return db.queryEntries(`
  SELECT * FROM products 
  WHERE bundleAmount is NULL;
  `);
};
export const getBundles = (db) => {
  return db.queryEntries(`
  SELECT * FROM products 
  WHERE bundleAmount is NOT NULL;
  `);
};
export const addProduct = (db, formData) => {
  db.query(
    `INSERT INTO products (name, text, price, priceDes, bundleAmount)
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
    SET name = $name,
    text = $text,
    price = $price,
    priceDes = $priceDes,
    bundleAmount = $bundleAmount
    WHERE id = $id;
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
    WHERE id = $id;
    `,
    {
      $id: id,
    },
  );
};
