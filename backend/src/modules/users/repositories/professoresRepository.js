import sql from "../../../shared/database/connection.js";

function sanitize(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : v])
  )
}

export async function createProfessor(usuarioId, dados) {
  const d = sanitize(dados);

  const rows = await sql/*sql*/`
    INSERT INTO professores (usuario_id, formacao, disciplinas, instituicao_vinculo, validado_pela_plataforma)
    VALUES (
      ${usuarioId},
      ${d.formacao},
      ${d.disciplinas},
      ${d.instituicao},
      false
    )
    RETURNING *
  `;
  return rows[0];
}
