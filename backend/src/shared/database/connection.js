
import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

const env = process.env.NODE_ENV || 'development'

let connectionString
let sslConfig = false
let poolSize = 5

switch (env) {
  case 'production':
    connectionString = process.env.DATABASE_URL
    sslConfig = { rejectUnauthorized: false } 
    poolSize = 20
    break

  case 'staging':
    connectionString = process.env.DATABASE_URL_STAGING
    sslConfig = { rejectUnauthorized: false }
    poolSize = 10
    break

  case 'test':
    connectionString = process.env.DATABASE_URL_TEST
    break

  default: 
    connectionString = process.env.DATABASE_URL_DEV
    break
}

if (!connectionString) {
  throw new Error(`DATABASE_URL não definida para ambiente: ${env}`)
}

const sql = postgres(connectionString, {
  ssl: sslConfig,
  max: poolSize,
})

export default sql
