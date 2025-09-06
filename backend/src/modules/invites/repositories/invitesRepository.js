import sql from "../../../shared/database/connection.js";
import Invite from "../models/Invite.js";

function sanitize(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : v])
  )
}

export async function createInvite(invite) {
  const i = sanitize(invite);

  const rows = await sql/*sql*/`
    INSERT INTO invites (
      token, professor_id, tipo, status, expires_at
    ) VALUES (
      ${i.token}, ${i.professorId}, ${i.tipo}, ${i.status}, ${i.expiresAt}
    )
    RETURNING *
  `;
  return new Invite(rows[0]);
}

export async function findInviteByToken(token) {
  const rows = await sql/*sql*/`
    SELECT * FROM invites WHERE token = ${token}
  `;
  return rows[0] ? new Invite(rows[0]) : null;
}

export async function updateInviteStatus(token, status) {
  const rows = await sql/*sql*/`
    UPDATE invites
    SET status = ${status}, updated_at = NOW()
    WHERE token = ${token}
    RETURNING *
  `;
  return rows[0] ? new Invite(rows[0]) : null;
}

export async function findInvitesByProfessor(professorId) {
  const rows = await sql/*sql*/`
    SELECT * FROM invites
    WHERE professor_id = ${professorId}
    ORDER BY created_at DESC
  `;
  return rows.map(row => new Invite(row));
}

export async function deleteInvite(token) {
  await sql/*sql*/`
    DELETE FROM invites WHERE token = ${token}
  `;
  return true;
}