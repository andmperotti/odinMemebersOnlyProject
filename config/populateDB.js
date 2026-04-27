const { Client } = require("pg");

const SQL = `
CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS public.users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstName TEXT, lastName TEXT, userName TEXT, passwordHash TEXT, membershipStatus TEXT
);

CREATE TABLE IF NOT EXISTS public.messages (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title TEXT, timestamp DATE, bodyText TEXT, authorId INTEGER
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString:
      "postgresql://drew:<role_password>@localhost:5432/members",
    // connectionString: process.env.DB_STRING,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

module.exports = { main };
