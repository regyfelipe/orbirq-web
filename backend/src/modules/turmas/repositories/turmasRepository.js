import sql from "../../../shared/database/connection.js"

function sanitize(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : v])
  )
}

export async function createTurma(turma) {
  const t = sanitize(turma);

  const rows = await sql/*sql*/`
    INSERT INTO turmas (
      nome, tenant_id, disciplina, ano, periodo, status, professor_id
    ) VALUES (
      ${t.nome}, ${t.tenantId}, ${t.disciplina}, ${t.ano}, ${t.periodo}, ${t.status}, ${t.professorId}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function findAllTurmas() {
  const rows = await sql/*sql*/`
    SELECT t.*, u.nome_completo as professor_nome
    FROM turmas t
    LEFT JOIN usuarios u ON t.professor_id = u.id
    ORDER BY t.created_at DESC
  `;
  return rows;
}

export async function findTurmaById(id) {
  const rows = await sql/*sql*/`
    SELECT t.*, u.nome_completo as professor_nome
    FROM turmas t
    LEFT JOIN usuarios u ON t.professor_id = u.id
    WHERE t.id = ${id}
  `;
  return rows[0] || null;
}

export async function findTurmasByProfessor(professorId) {
  const rows = await sql/*sql*/`
    SELECT t.*, u.nome_completo as professor_nome
    FROM turmas t
    LEFT JOIN usuarios u ON t.professor_id = u.id
    WHERE t.professor_id = ${professorId}
    ORDER BY t.created_at DESC
  `;
  return rows;
}

export async function updateTurma(id, updates) {
  const u = sanitize(updates);
  const setParts = [];
  const values = [];

  Object.keys(u).forEach(key => {
    if (u[key] !== null) {
      setParts.push(`${key} = $${values.length + 1}`);
      values.push(u[key]);
    }
  });

  if (setParts.length === 0) {
    throw new Error("No valid fields to update");
  }

  const setClause = setParts.join(', ');
  values.push(id);

  const query = `
    UPDATE turmas
    SET ${setClause}, updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING *
  `;

  const rows = await sql.unsafe(query, values);
  return rows[0];
}

export async function deleteTurma(id) {
  const rows = await sql/*sql*/`
    DELETE FROM turmas WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

export async function addAlunoToTurma(alunoId, turmaId) {
  console.log("💾 [REPOSITORY] Inserindo aluno na tabela alunos_turmas:", { alunoId, turmaId })

  const rows = await sql/*sql*/`
    INSERT INTO alunos_turmas (aluno_id, turma_id)
    VALUES (${alunoId}, ${turmaId})
    ON CONFLICT (aluno_id, turma_id) DO NOTHING
    RETURNING *
  `;

  console.log("✅ [REPOSITORY] Resultado da inserção:", rows[0] || "Nenhuma linha retornada (possível conflito)")
  return rows[0];
}

export async function removeAlunoFromTurma(alunoId, turmaId) {
  const rows = await sql/*sql*/`
    DELETE FROM alunos_turmas
    WHERE aluno_id = ${alunoId} AND turma_id = ${turmaId}
    RETURNING *
  `;
  return rows[0];
}

export async function getAlunosFromTurma(turmaId) {
  const rows = await sql/*sql*/`
    SELECT u.*, at.joined_at
    FROM usuarios u
    JOIN alunos_turmas at ON u.id = at.aluno_id
    WHERE at.turma_id = ${turmaId}
    ORDER BY at.joined_at DESC
  `;
  return rows;
}