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
      $name: formData.product_name,
      $text: formData.product_text,
      $price: formData.product_price,
      $priceDes: formData.product_priceDes,
      $bundleAmount: formData.product_bundleAmount,
    }
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
      $id: formData.product_id,
      $name: formData.product_name,
      $text: formData.product_text,
      $price: formData.product_price,
      $priceDes: formData.product_priceDes,
      $bundleAmount: formData.product_bundleAmount,
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
