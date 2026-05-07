const pool = require("./pool");

async function saveUser(
  firstName = "",
  lastName = "",
  username,
  hashedPassword,
) {
  let values = [
    firstName,
    lastName,
    username,
    hashedPassword,
    (membershipStatus = "beginner"),
  ];
  let saveUserAttempt = pool.query(
    "INSERT INTO users (firstName, lastName, userName, passwordHash, membershipStatus) VALUES($1, $2, $3, $4, $5)",
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
    "SELECT passwordhash FROM users where username = $1",
    [username],
  );
  return hashReturn.rows[0].passwordhash;
}

module.exports = {
  saveUser,
  findUser,
  setMember,
  findUserById,
  getUserPasswordHash,
};
