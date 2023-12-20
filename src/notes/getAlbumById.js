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
