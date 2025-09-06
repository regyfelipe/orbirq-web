import sql from '../src/shared/database/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Executando migrações...');

    // Lista de migrações a executar em ordem
    const migrations = [
      '007_create_turmas_table.sql',
      '008_create_alunos_table.sql',
      '009_create_professores_table.sql'
    ];

    for (const migrationFile of migrations) {
      const migrationPath = path.join(__dirname, '../migrations', migrationFile);

      if (fs.existsSync(migrationPath)) {
        console.log(`📄 Executando ${migrationFile}...`);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        await sql.unsafe(migrationSQL);
        console.log(`✅ ${migrationFile} executada com sucesso!`);
      } else {
        console.log(`⚠️  Arquivo ${migrationFile} não encontrado, pulando...`);
      }
    }

    console.log('🎉 Todas as migrações executadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
}

runMigration();