import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable, refreshTokensTable } from '../db/schema.ts';
import { and, eq, gt, lt, sql } from 'drizzle-orm';
import jwt from "jsonwebtoken"
import * as schema from '../db/schema.ts'
  
const db = drizzle(process.env.DATABASE_URL!, {schema});

export const getUserByLoginCredentials = async (username: string, password: string): Promise<{id: number} | undefined> => {
  return await db.query.usersTable.findFirst({
    where: and(
      eq(usersTable.username, username),
      eq(usersTable.password, password)
    )
  })

}

export const getUserByUsername = async (username: string) => {
  return await db.query.usersTable.findFirst({
    where: eq(usersTable.username, username), 
    columns: {id: true, password: true, username: true}
  })
}

export const createNewUser = async (username: string, password: string): Promise<void> => {
  // create user

  await db.insert(usersTable).values(
    {
      username, 
      password
    }
  )
}

export const addRefreshTokenToDatabase = async(refreshTokenId: string, expiresAtUTC: number) => {
  await db.insert(refreshTokensTable).values(
    {
      id: refreshTokenId,
      expires_at: expiresAtUTC
    }
  )
}

export const getValidRefreshTokenDBRecord = async (refreshToken: string) => {
  return await db.query.refreshTokensTable.findFirst({
    where: and(
      eq(refreshTokensTable.id, refreshToken),
      gt(refreshTokensTable.expires_at, Math.floor(Date.now()/ 1000))
    )
  })
}