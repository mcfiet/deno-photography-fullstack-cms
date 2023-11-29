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
