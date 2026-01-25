import type { Request, Response } from "express";
import { createNewUser, getUserByUsername } from "./data/auth.data.ts";
import type { LoginInput, LoginResponse } from "./types/auth.types.ts";
import type { ErrorResponse } from "./types/global.types.ts";
import bcrypt from "bcryptjs";
import express from "express"

export const authRouter = express.Router();

authRouter.post("/login", async (req: Request<any, any, LoginInput>, res: Response<LoginResponse | ErrorResponse>): Promise<void> => {
  try {
    const {username, password} = req.body;
    const user = await getUserByUsername(username);
    console.log({user})
    
    if (user) {
      console.log("user.password: ", user.password)
      console.log("input password: ", password)
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        res.status(200).json({
          accessToken: "testAccessToken",
        })
      } else {
        res.status(404).json({
          message: "incorrect password"
        })
      }
    } else {
      res.status(404).json({
        message: "user doesn't exist",
      })
    }
  } catch(e: any) {
    if (e instanceof Error) {
      res.status(400).json({
        message: e.message
      })
    } else {
      res.status(500).json({
        message: "unknown server error"
      })
    }
  }
})

authRouter.post("/signup", async (req, res) => {
  try {
    const {username, password} = req.body;
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
    res.status(400).json({
      message: "username already in use"
    })
  } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const accessToken = await createNewUser(username, hashedPassword)
      res.status(200).json({
        accessToken
      })
  }
} catch(e: any) {
    res.status(400).json({
      message: e.message || "Unknown Server Error"
    })
  }
})