/**
 * Cliente Prisma Singleton
 * Configurado para Prisma 7 con adaptador PostgreSQL
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

function createPrismaClient(): PrismaClient {
  // Crear pool de conexiones
  const pool = globalForPrisma.pool ?? new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool
  }

  // Crear adaptador de Prisma para PostgreSQL
  const adapter = new PrismaPg(pool)

  // Crear cliente Prisma con el adaptador
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
