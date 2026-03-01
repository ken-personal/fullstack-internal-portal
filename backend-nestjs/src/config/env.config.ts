import * as dotenv from 'dotenv'
dotenv.config()

export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/db'
