import express from "express"

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL!);

const app = express()
const PORT = 3000;

app.listen(PORT, (error: Error | undefined) => {
  if (!error) {
    console.log(`app listening at port ${PORT}`)
  } else {
    console.error(`failed to connect to server at port ${PORT}`)
  }
})
