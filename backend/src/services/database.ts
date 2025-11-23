import { Pool, QueryResult, QueryResultRow } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://root:root@localhost:5001/bcvs',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
  console.error('[Database] Unexpected error on idle client', err)
})

export async function queryDatabase<T extends QueryResultRow = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now()
  try {
    const result = await pool.query<T>(text, params)
    const duration = Date.now() - start
    console.log('[Database] Query executed in', duration, 'ms')
    return result
  } catch (error) {
    console.error('[Database] Query error:', error)
    throw error
  }
}

export async function getDatabaseConnection() {
  return pool.connect()
}

export async function closeDatabaseConnection() {
  await pool.end()
}
