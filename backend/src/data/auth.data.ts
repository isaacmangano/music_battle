import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from '../db/schema.ts';
import { and, eq } from 'drizzle-orm';
import * as schema from "../db/schema.ts"
  
const db = drizzle(process.env.DATABASE_URL!, {schema});

export const getUserByLoginCredentials = async (username: string, password: string): Promise<{id: number} | undefined> => {
  return await db.query.usersTable.findFirst({
    where: and(
      eq(usersTable.username, username),
      eq(usersTable.password, password)
    )
  })

}

export const getUserByUsername = async (username: string): Promise<{id: number, username: string, password: string} | undefined> => {
  return await db.query.usersTable.findFirst({
    where: eq(usersTable.username, username), 
    columns: {id: true, password: true, username: true}
  })
}

export const createNewUser = async (username: string, password: string): Promise<string> => {
  // create user

  const user = await db.insert(usersTable).values(
    {
      username, 
      password
    }
  )
  console.log({user})
  return "testAccessToken"
}