import sql from './src/shared/database/connection.js';

async function checkTurmas() {
  try {
    console.log('Checking turmas table...');

    // Check if table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'turmas'
      )
    `;

    console.log('Turmas table exists:', tableExists[0].exists);

    if (tableExists[0].exists) {
      // Count turmas
      const countResult = await sql`
        SELECT COUNT(*) as count FROM turmas
      `;
      console.log('Total turmas:', countResult[0].count);

      // List all turmas
      const turmas = await sql`
        SELECT id, nome, status, created_at FROM turmas ORDER BY created_at DESC
      `;
      console.log('Turmas:', turmas);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTurmas();