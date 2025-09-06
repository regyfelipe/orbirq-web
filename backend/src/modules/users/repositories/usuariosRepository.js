import sql from "../../../shared/database/connection.js"

function sanitize(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : v])
  )
}

export async function createUsuario(usuario) {
  const u = sanitize(usuario);

  const rows = await sql/*sql*/`
    INSERT INTO usuarios (
      nome_completo, email, username, senha_hash, role,
      foto_perfil_url, telefone, genero, data_nascimento,
      pais, estado, cidade, bio
    ) VALUES (
      ${u.nomeCompleto}, ${u.email}, ${u.username}, ${u.senhaHash}, ${u.role},
      ${u.fotoPerfilUrl}, ${u.telefone}, ${u.genero}, ${u.dataNascimento},
      ${u.pais}, ${u.estado}, ${u.cidade}, ${u.bio}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function findByEmail(email) {
  const rows = await sql/*sql*/`
    SELECT * FROM usuarios WHERE email = ${email}
  `
  return rows[0] || null
}

export async function findByUsername(username) {
  const rows = await sql/*sql*/`
    SELECT * FROM usuarios WHERE username = ${username}
  `
  return rows[0] || null
}

export async function findByRole(role) {
  const rows = await sql/*sql*/`
    SELECT * FROM usuarios WHERE role = ${role}
  `
  return rows
}
