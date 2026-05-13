const pool = require("./pool");

async function saveUser(firstName, lastName, username, hashedPassword, admin) {
  let values = [
    firstName,
    lastName,
    username,
    hashedPassword,
    (membershipStatus = "beginner"),
    admin,
  ];
  let saveUserAttempt = pool.query(
    "INSERT INTO users (firstName, lastName, userName, passwordhash, membershipstatus, admin) VALUES($1, $2, $3, $4, $5, $6)",
    values,
  );
}

async function findUser(username) {
  let values = [username];
  let query = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    values,
  );
  return query.rowCount > 0 ? query.rows[0] : false;
}

async function findUserById(userId) {
  let query = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
  return query.rows[0];
}

async function setMember(username) {
  let values = [username];
  await pool.query(
    `UPDATE users SET membershipstatus = 'member' WHERE username = $1`,
    values,
  );
}

async function getUserPasswordHash(username) {
  const hashReturn = await pool.query(
    "SELECT passwordhash FROM users WHERE username = $1",
    [username],
  );
  return hashReturn.rowCount > 0 ? hashReturn.rows[0].passwordhash : false;
}

async function createMessage(userId, title, bodyText) {
  //might have to query out the users id using findUserId

  let values = [title, bodyText, userId];
  const messageCreation = pool.query(
    "INSERT INTO messages (title, timestamp, bodyText, authorId) VALUES ($1, CURRENT_TIMESTAMP, $2, $3)",
    values,
  );
}

async function getMessages() {
  let messages = await pool.query("SELECT * FROM messages ORDER BY id");
  return messages.rows;
}

async function getUsers() {
  let users = await pool.query("SELECT * FROM users ORDER BY id");
  return users.rows;
}

async function deleteMessage(messageid) {
  let deletionAttempt = await pool.query("DELETE FROM messages WHERE id = $1", [
    messageid,
  ]);
}

module.exports = {
  saveUser,
  findUser,
  setMember,
  findUserById,
  getUserPasswordHash,
  createMessage,
  getMessages,
  getUsers,
  deleteMessage,
};
