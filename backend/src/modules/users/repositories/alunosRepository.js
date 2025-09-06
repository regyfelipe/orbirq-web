import sql from "../../../shared/database/connection.js";

export async function createAluno(usuarioId, dados) {
  const rows = await sql/*sql*/`
    INSERT INTO alunos (usuario_id, curso, nivel, instituicao, turma)
    VALUES (${usuarioId}, ${dados.curso}, ${dados.nivel}, ${dados.instituicao}, ${dados.turma})
    RETURNING *
  `;
  return rows[0];
}
