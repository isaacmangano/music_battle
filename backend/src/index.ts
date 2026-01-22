import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import express from "express"
import SocketService from "./Socket.ts"

const db = drizzle(process.env.DATABASE_URL!);
const app = express()
const PORT = 3000;

try {
  const socketService = new SocketService(app, PORT);
  socketService.listen();
} catch (e: any) {
  console.error(`unable to listen to web scket server at port 3000`);
}