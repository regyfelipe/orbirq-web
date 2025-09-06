import sql from '../../../shared/database/connection.js';

export async function createInvite(professorId, expiresIn, tipo = 'unico') {
  try {
    // Buscar dados do professor
    const professorResult = await sql/*sql*/`
      SELECT nome_completo, email FROM usuarios
      WHERE id = ${professorId} AND role = 'professor'
    `;

    if (professorResult.length === 0) {
      throw new Error('Professor não encontrado');
    }

    const professor = professorResult[0];

    // Gerar token único
    const token = `${professorId}_${Math.random().toString(36).substring(2, 15)}`;

    // Calcular data de expiração
    let expiresAt = null;
    if (expiresIn && expiresIn !== 'infinito') {
      const hours = parseInt(expiresIn);
      expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
    }

    // Inserir convite no banco
    const result = await sql/*sql*/`
      INSERT INTO convites (
        token, professor_id, professor_name, professor_email,
        tipo, status, expires_at, created_at
      ) VALUES (
        ${token}, ${professorId}, ${professor.nome_completo},
        ${professor.email}, ${tipo}, 'pending', ${expiresAt}, NOW()
      )
      RETURNING *
    `;

    return {
      id: result[0].id,
      token: result[0].token,
      professorId: result[0].professor_id,
      professorName: result[0].professor_name,
      professorEmail: result[0].professor_email,
      tipo: result[0].tipo,
      status: result[0].status,
      expiresAt: result[0].expires_at,
      createdAt: result[0].created_at
    };
  } catch (error) {
    console.error('Erro ao criar convite:', error);
    throw error;
  }
}

export async function getInviteByToken(token) {
  try {
    const result = await sql/*sql*/`
      SELECT c.*, u.nome_completo as professor_name, u.email as professor_email
      FROM convites c
      JOIN usuarios u ON c.professor_id = u.id
      WHERE c.token = ${token}
    `;

    return result[0] || null;
  } catch (error) {
    console.error('Erro ao buscar convite:', error);
    throw error;
  }
}

export async function updateInviteStatus(token, status, alunoId = null) {
  try {
    const result = await sql/*sql*/`
      UPDATE convites
      SET status = ${status}, aluno_id = ${alunoId}, updated_at = NOW()
      WHERE token = ${token}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error('Convite não encontrado');
    }

    return result[0];
  } catch (error) {
    console.error('Erro ao atualizar status do convite:', error);
    throw error;
  }
}

export async function getInvitesByProfessor(professorId) {
  try {
    const result = await sql/*sql*/`
      SELECT * FROM convites
      WHERE professor_id = ${professorId}
      ORDER BY created_at DESC
    `;

    return result;
  } catch (error) {
    console.error('Erro ao buscar convites do professor:', error);
    throw error;
  }
}

export async function getAcceptedStudentsByProfessor(professorId) {
  try {
    const result = await sql/*sql*/`
      SELECT
        u.id,
        u.nome_completo as nome,
        u.email,
        c.created_at as data_aceite,
        c.token as convite_token
      FROM convites c
      JOIN usuarios u ON c.aluno_id = u.id
      WHERE c.professor_id = ${professorId}
        AND c.status = 'accepted'
        AND c.aluno_id IS NOT NULL
      ORDER BY c.created_at DESC
    `;

    return result;
  } catch (error) {
    console.error('Erro ao buscar alunos aceitos:', error);
    throw error;
  }
}