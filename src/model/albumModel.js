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
WHERE album_id = $albumId;
  `,
    {
      $albumId: id,
    }
  );
  return album[0];
};

export const getCategoryByAlbumId = (db, id) => {
  const album = db.queryEntries(
    `
  SELECT category_id, category_name FROM albums
  JOIN categories 
  ON category_id = album_category
  WHERE album_id = $albumId;
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
      $albumName: formData.album_title,
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

export const saveAlbumImageById = (db, albumId, filename, image_alt) => {
  return db.queryEntries(
    `
  INSERT INTO albums_images(fk_albums_id, albums_images_link, image_alt)
VALUES ($albumId, $filename, $imageAlt);
  `,
    {
      $albumId: albumId,
      $filename: filename,
      $imageAlt: image_alt,
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
      $album_title: formData.album_title,
      $albums_category: formData.category.category_id,
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
