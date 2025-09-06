import sql from "../../../shared/database/connection.js";

export async function findUserByEmail(email) {
  const rows = await sql/*sql*/`
    SELECT * FROM usuarios WHERE email = ${email}
  `;
  return rows[0] || null;
}

export async function findUserByUsername(username) {
  const rows = await sql/*sql*/`
    SELECT * FROM usuarios WHERE username = ${username}
  `;
  return rows[0] || null;
}