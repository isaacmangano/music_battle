import { date, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull()
});

export const refreshTokensTable = pgTable("refresh_token", {
  id: varchar({ length: 255 }).primaryKey(),
  expires_at: integer().notNull()
})