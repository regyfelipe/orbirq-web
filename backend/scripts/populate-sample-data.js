import sql from '../src/shared/database/connection.js';
import bcrypt from 'bcrypt';

async function populateSampleData() {
  try {
    console.log('🌱 Populando banco de dados com dados de exemplo...');

    // 1. Verificar se existe usuário de exemplo
    let userId;
    const [existingUser] = await sql`SELECT id FROM usuarios LIMIT 1`;

    if (existingUser) {
      userId = existingUser.id;
      console.log('✅ Usuário encontrado:', userId);
    } else {
      console.log('❌ Nenhum usuário encontrado. Execute as migrações primeiro.');
      process.exit(1);
    }

    console.log('✅ Usuário criado/obtido:', userId);

    // 2. Criar algumas questões de exemplo
    const questoes = [
      {
        id: 'q1',
        versao: 1,
        pergunta: 'Quanto é 2 + 2?',
        texto: 'Resolva a seguinte operação matemática básica.',
        tipo: 'multipla_escolha',
        opcoes: JSON.stringify(['2', '3', '4', '5']),
        resposta_correta: '4',
        disciplina: 'Matemática',
        materia: 'Aritmética',
        assunto: 'Adição',
        nivel_dificuldade: 'facil',
        explicacao: 'A adição de 2 + 2 resulta em 4.',
        autoria: JSON.stringify({ principal: 'Professor Silva', revisores: [] })
      },
      {
        id: 'q2',
        versao: 1,
        pergunta: 'Qual é a capital do Brasil?',
        texto: 'Pergunta de geografia sobre o Brasil.',
        tipo: 'multipla_escolha',
        opcoes: JSON.stringify(['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador']),
        resposta_correta: 'Brasília',
        disciplina: 'Geografia',
        materia: 'Geografia do Brasil',
        assunto: 'Capitais',
        nivel_dificuldade: 'medio',
        explicacao: 'Brasília é a capital federal do Brasil desde 1960.',
        autoria: JSON.stringify({ principal: 'Professora Maria', revisores: [] })
      },
      {
        id: 'q3',
        versao: 1,
        pergunta: 'Complete: O sol ___ no leste.',
        texto: 'Complete a frase com a palavra correta.',
        tipo: 'multipla_escolha',
        opcoes: JSON.stringify(['nasce', 'morre', 'some', 'aparece']),
        resposta_correta: 'nasce',
        disciplina: 'Português',
        materia: 'Gramática',
        assunto: 'Verbos',
        nivel_dificuldade: 'facil',
        explicacao: 'O verbo correto é "nasce" pois o sol surge no horizonte leste.',
        autoria: JSON.stringify({ principal: 'Professor João', revisores: [] })
      }
    ];

    for (const questao of questoes) {
      await sql`
        INSERT INTO questoes (
          id, versao, pergunta, texto, tipo, opcoes, resposta_correta,
          disciplina, materia, assunto, nivel_dificuldade, explicacao, autoria,
          status, data_criacao, ultima_atualizacao
        ) VALUES (
          ${questao.id}, ${questao.versao}, ${questao.pergunta}, ${questao.texto}, ${questao.tipo},
          ${questao.opcoes}, ${questao.resposta_correta}, ${questao.disciplina},
          ${questao.materia}, ${questao.assunto}, ${questao.nivel_dificuldade},
          ${questao.explicacao}, ${questao.autoria}, 'ativo', NOW(), NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }

    console.log('✅ Questões criadas');

    // 3. Criar respostas de exemplo para simular histórico
    const respostas = [];
    const dataBase = new Date();
    dataBase.setDate(dataBase.getDate() - 30); // Começar 30 dias atrás

    for (let i = 0; i < 25; i++) {
      const dataResposta = new Date(dataBase);
      dataResposta.setDate(dataBase.getDate() + Math.floor(i / 2)); // 2 respostas por dia em média

      // Escolher questão aleatória
      const questaoId = questoes[Math.floor(Math.random() * questoes.length)].id;

      // 70% de chance de acertar
      const acertou = Math.random() < 0.7;
      const respostaEscolhida = acertou ?
        questoes.find(q => q.id === questaoId).resposta_correta :
        'opcao_errada'; // Simular erro

      respostas.push({
        aluno_id: userId,
        questao_id: questaoId,
        opcao_escolhida: respostaEscolhida,
        correta: acertou,
        tempo_resposta_segundos: Math.floor(Math.random() * 120) + 30, // 30-150 segundos
        respondida_em: dataResposta
      });
    }

    for (const resposta of respostas) {
      try {
        await sql`
          INSERT INTO respostas (
            aluno_id, questao_id, opcao_escolhida, correta,
            tempo_resposta_segundos, respondida_em
          ) VALUES (
            ${resposta.aluno_id}, ${resposta.questao_id}, ${resposta.opcao_escolhida},
            ${resposta.correta}, ${resposta.tempo_resposta_segundos}, ${resposta.respondida_em}
          )
        `;
      } catch (error) {
        // Ignorar erros de duplicata
        if (!error.message.includes('duplicate key value')) {
          throw error;
        }
      }
    }

    console.log('✅ Respostas criadas');

    // 4. Atualizar dados de gamificação do usuário
    const [stats] = await sql`
      SELECT
        COUNT(*) as total_questoes,
        AVG(correta::int) as taxa_acerto,
        COUNT(DISTINCT DATE(respondida_em)) as dias_ativos
      FROM respostas
      WHERE aluno_id = ${userId}
    `;

    await sql`
      UPDATE usuarios
      SET
        current_streak = ${Math.floor(stats.dias_ativos * 0.7)}, -- Simular streak
        longest_streak = ${Math.floor(stats.dias_ativos * 0.8)},
        total_xp = ${stats.total_questoes * 10},
        level = ${Math.floor(stats.total_questoes / 10) + 1},
        last_study_date = CURRENT_DATE
      WHERE id = ${userId}
    `;

    console.log('✅ Dados de gamificação atualizados');

    console.log('🎉 Banco de dados populado com sucesso!');
    console.log(`📊 Estatísticas criadas:`);
    console.log(`   - Usuário: ${userId}`);
    console.log(`   - Questões: ${questoes.length}`);
    console.log(`   - Respostas: ${respostas.length}`);
    console.log(`   - Taxa de acerto: ${Math.round(stats.taxa_acerto * 100)}%`);

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
  } finally {
    process.exit(0);
  }
}

populateSampleData();