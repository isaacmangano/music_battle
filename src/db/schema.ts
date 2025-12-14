import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 20 }).notNull()
});
