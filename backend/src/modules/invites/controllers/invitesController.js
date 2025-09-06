import { createInvite, getInviteByToken, updateInviteStatus, getInvitesByProfessor, getAcceptedStudentsByProfessor } from '../services/invitesService.js';

export async function createInviteController(req, res) {
  try {
    const { professorId, expiresIn, tipo } = req.body;

    if (!professorId) {
      return res.status(400).json({ error: 'ID do professor é obrigatório' });
    }

    const invite = await createInvite(professorId, expiresIn, tipo);
    res.status(201).json(invite);
  } catch (error) {
    console.error('Erro ao criar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getInviteController(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Token é obrigatório' });
    }

    const invite = await getInviteByToken(token);

    if (!invite) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    // Verificar se o convite expirou
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return res.status(410).json({
        error: 'Convite expirado',
        status: 'expired'
      });
    }

    res.json({
      token: invite.token,
      professorName: invite.professor_name,
      professorEmail: invite.professor_email,
      expiresAt: invite.expires_at,
      status: invite.status,
      createdAt: invite.created_at
    });
  } catch (error) {
    console.error('Erro ao buscar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function acceptInviteController(req, res) {
  try {
    const { token } = req.params;
    const { alunoId } = req.body;

    if (!token || !alunoId) {
      return res.status(400).json({ error: 'Token e ID do aluno são obrigatórios' });
    }

    const result = await updateInviteStatus(token, 'accepted', alunoId);
    res.json(result);
  } catch (error) {
    console.error('Erro ao aceitar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getProfessorInvitesController(req, res) {
  try {
    const { professorId } = req.params;

    if (!professorId) {
      return res.status(400).json({ error: 'ID do professor é obrigatório' });
    }

    const invites = await getInvitesByProfessor(professorId);
    res.json(invites);
  } catch (error) {
    console.error('Erro ao buscar convites do professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getAcceptedStudentsController(req, res) {
  try {
    const { professorId } = req.params;

    if (!professorId) {
      return res.status(400).json({ error: 'ID do professor é obrigatório' });
    }

    const students = await getAcceptedStudentsByProfessor(professorId);
    res.json(students);
  } catch (error) {
    console.error('Erro ao buscar alunos aceitos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}