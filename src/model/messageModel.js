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
