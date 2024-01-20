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

export const getMessageById = (db, id) => {
  return db.queryEntries(
    `SELECT * FROM messages
    WHERE message_id = $id`,
    {
      $id: id,
    }
  )[0];
};

export const removeMessageById = (db, id) => {
  db.query(
    `DELETE FROM messages
    WHERE message_id = $id`,
    {
      $id: id,
    }
  );
};
