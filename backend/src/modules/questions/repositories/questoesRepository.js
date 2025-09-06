import sql from "../../../shared/database/connection.js"

export async function findAll(limit, offset) {
  const rows = await sql/*sql*/`
    SELECT * FROM questoes
    ORDER BY data_criacao DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  // Parse JSONB fields
  return rows.map(row => ({
    ...row,
    opcoes: typeof row.opcoes === 'string' ? JSON.parse(row.opcoes) : row.opcoes,
    objetivos_aprendizagem: typeof row.objetivos_aprendizagem === 'string' ? JSON.parse(row.objetivos_aprendizagem) : row.objetivos_aprendizagem,
    referencias: typeof row.referencias === 'string' ? JSON.parse(row.referencias) : row.referencias,
    links_videos: typeof row.links_videos === 'string' ? JSON.parse(row.links_videos) : row.links_videos,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    palavras_chave: typeof row.palavras_chave === 'string' ? JSON.parse(row.palavras_chave) : row.palavras_chave,
    estatisticas: typeof row.estatisticas === 'string' ? JSON.parse(row.estatisticas) : row.estatisticas,
    plano_disponibilidade: typeof row.plano_disponibilidade === 'string' ? JSON.parse(row.plano_disponibilidade) : row.plano_disponibilidade,
    monetizacao: typeof row.monetizacao === 'string' ? JSON.parse(row.monetizacao) : row.monetizacao,
    protecao: typeof row.protecao === 'string' ? JSON.parse(row.protecao) : row.protecao,
    gamificacao: typeof row.gamificacao === 'string' ? JSON.parse(row.gamificacao) : row.gamificacao,
    ia: typeof row.ia === 'string' ? JSON.parse(row.ia) : row.ia,
    autoria: typeof row.autoria === 'string' ? JSON.parse(row.autoria) : row.autoria
  }))
}

export async function findById(id) {
  const rows = await sql/*sql*/`
    SELECT * FROM questoes
    WHERE id = ${id}
  `
  return rows[0] || null
}

export async function countAll() {
  const rows = await sql/*sql*/`
    SELECT COUNT(*)::int AS total FROM questoes
  `
  return rows[0]?.total || 0
}

export async function create(questaoData) {
  // Usar apenas campos essenciais baseados nos dados existentes
  const data = {
    id: questaoData.id || `q${Date.now()}`,
    status: questaoData.status || 'ativo',
    versao: questaoData.versao || 1,
    disciplina: questaoData.disciplina || 'Geral',
    materia: questaoData.materia || '',
    assunto: questaoData.assunto || '',
    banca: questaoData.banca || '',
    ano: questaoData.ano || null,
    instituicao: questaoData.instituicao || '',
    inedita: questaoData.inedita !== undefined ? questaoData.inedita : true,
    autoria: questaoData.autoria || { principal: 'Professor(a)', revisores: [] },
    data_criacao: questaoData.data_criacao || new Date().toISOString(),
    ultima_atualizacao: questaoData.ultima_atualizacao || new Date().toISOString(),
    texto: questaoData.texto || 'Sem texto',
    imagem_url: questaoData.imagem_url || null,
    pergunta: questaoData.pergunta || '',
    tipo: questaoData.tipo || 'multipla_escolha',
    opcoes: questaoData.opcoes || [],
    resposta_correta: questaoData.resposta_correta || '',
    objetivos_aprendizagem: questaoData.objetivos_aprendizagem || [],
    explicacao: questaoData.explicacao || '',
    referencias: questaoData.referencias || [],
    links_videos: questaoData.links_videos || [],
    nivel_dificuldade: questaoData.nivel_dificuldade || 'medio',
    tags: questaoData.tags || [],
    palavras_chave: questaoData.palavras_chave || [],
    estatisticas: questaoData.estatisticas || { vezesRespondida: 0, taxaAcerto: 0 },
    licenca_uso: questaoData.licenca_uso || 'premium',
    plano_disponibilidade: questaoData.plano_disponibilidade || ['free'],
    custo_criacao: questaoData.custo_criacao || 5.00,
    visibilidade: questaoData.visibilidade || 'privada',
    descricao_imagem: questaoData.descricao_imagem || null,
    schema_version: questaoData.schema_version || 2,
    monetizacao: questaoData.monetizacao || { modelo: 'assinatura', valor_por_acesso: 0 },
    protecao: questaoData.protecao || { hash: null, assinatura_digital: null },
    gamificacao: questaoData.gamificacao || { xp: 0, medalha: null },
    ia: questaoData.ia || { gerado_por: 'humano', dicas: [] }
  }

  console.log('Tentando inserir questão com ID:', data.id)

  // Inserir apenas os campos que existem na estrutura atual
  const rows = await sql/*sql*/`
    INSERT INTO questoes (
      id, status, versao, disciplina, materia, assunto, banca, ano, instituicao,
      inedita, autoria, data_criacao, ultima_atualizacao, texto, imagem_url,
      pergunta, tipo, opcoes, resposta_correta, objetivos_aprendizagem, explicacao,
      referencias, links_videos, nivel_dificuldade, tags, palavras_chave, estatisticas,
      licenca_uso, plano_disponibilidade, custo_criacao, visibilidade, descricao_imagem,
      schema_version, monetizacao, protecao, gamificacao, ia
    ) VALUES (
      ${data.id}, ${data.status}, ${data.versao}, ${data.disciplina}, ${data.materia},
      ${data.assunto}, ${data.banca}, ${data.ano}, ${data.instituicao}, ${data.inedita},
      ${JSON.stringify(data.autoria)}, ${data.data_criacao}, ${data.ultima_atualizacao},
      ${data.texto}, ${data.imagem_url}, ${data.pergunta}, ${data.tipo},
      ${JSON.stringify(data.opcoes)}, ${data.resposta_correta},
      ${JSON.stringify(data.objetivos_aprendizagem)}, ${data.explicacao},
      ${JSON.stringify(data.referencias)}, ${JSON.stringify(data.links_videos)},
      ${data.nivel_dificuldade}, ${JSON.stringify(data.tags)},
      ${JSON.stringify(data.palavras_chave)}, ${JSON.stringify(data.estatisticas)},
      ${data.licenca_uso}, ${JSON.stringify(data.plano_disponibilidade)},
      ${data.custo_criacao}, ${data.visibilidade}, ${data.descricao_imagem},
      ${data.schema_version}, ${JSON.stringify(data.monetizacao)},
      ${JSON.stringify(data.protecao)}, ${JSON.stringify(data.gamificacao)},
      ${JSON.stringify(data.ia)}
    )
    RETURNING *
  `
  return rows[0]
}

export async function update(id, updateData) {
  const fields = []
  const values = []
  let paramIndex = 1

  Object.keys(updateData).forEach(key => {
    if (key !== 'id') {
      const value = updateData[key]
      if (typeof value === 'object' && value !== null) {
        fields.push(`${key} = $${paramIndex}`)
        values.push(JSON.stringify(value))
      } else {
        fields.push(`${key} = $${paramIndex}`)
        values.push(value)
      }
      paramIndex++
    }
  })

  if (fields.length === 0) return null

  values.push(id) // Add id at the end for WHERE clause

  const query = /*sql*/`
    UPDATE questoes
    SET ${fields.join(', ')}, ultima_atualizacao = NOW()
    WHERE id = $${paramIndex}
    RETURNING *
  `

  const rows = await sql(query, values)
  return rows[0] || null
}

export async function remove(id) {
  const rows = await sql/*sql*/`
    DELETE FROM questoes
    WHERE id = ${id}
    RETURNING id
  `
  return rows.length > 0
}
