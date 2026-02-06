const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });
const { Client } = require('pg');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set in frontend/.env.local');
  process.exit(1);
}

(async () => {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 as ok');
    console.log('DB connection successful:', res.rows);
    await client.end();
  } catch (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
})();
