const pool = require("./pool");

// async function getUser(username) {
//   let values = [username];
//   let usernameResult = await pool.query(
//     `SELECT * FROM users WHERE username=$1`,
//     values,
//   );
//   return usernameResult.rows[0].name;
// }

async function saveUser(firstName, lastName, username, hashedPassword) {
  let values = [firstName, lastName, username, hashedPassword];
  let saveUserAttempt = pool.query(
    'INSERT INTO users (firstName, lastName, userName, passwordHash, membershipStatus) VALUES($1, $2, $3, $4, "beginner") ',
  );
}
