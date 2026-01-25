import 'dotenv/config';
import express from "express"
import type {Request, Response} from "express";
import SocketService from "./Socket.ts"
import type {LoginInput, LoginResponse} from "./types/auth.types.ts"
import type { ErrorResponse } from './types/global.types.ts';
import { createNewUser, getUserByLoginCredentials, getUserByUsername } from './data/auth.data.ts';
import bcrypt from "bcryptjs"
import { authRouter } from './auth.ts';

export const app = express()
const PORT = 3000;

try {
  const socketService = new SocketService(app, PORT);
  socketService.listen();
} catch (e: any) {
  console.error(`unable to listen to web scket server at port 3000`);
}

app.use(express.json())
app.use('/auth', authRouter)
