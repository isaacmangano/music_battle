import type { Request, Response } from "express";
import { addRefreshTokenToDatabase, createNewUser, getUserByUsername, getValidRefreshTokenDBRecord } from "./data/auth.data.ts";
import type { LoginInput, LoginResponse } from "./types/auth.types.ts";
import type { ErrorResponse } from "./types/global.types.ts";
import bcrypt from "bcryptjs";
import express from "express"
import jwt from "jsonwebtoken";
import type {JwtPayload } from "jsonwebtoken";
import {randomUUID} from "crypto"
import { verifyAccessToken } from "./middleware.ts";

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
  const tokens = await generateAccessAndRefreshTokens(username)
        res.status(200).json(tokens)
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
      await createNewUser(username, hashedPassword)
      const tokens = generateAccessAndRefreshTokens(username)

      res.status(200).json(tokens)
  }
} catch(e: any) {
    res.status(400).json({
      message: e.message || "Unknown Server Error"
    })
  }
})

const generateAccessAndRefreshTokens = async (username: string) => {

  const accessToken = jwt.sign(
    {username}, 
    process.env.JWT_SECRET!, 
    { expiresIn: "2m" })

  const refreshToken = jwt.sign(
    {
      jti: randomUUID(),
       username
    }, 
    process.env.JWT_SECRET!, 
    { expiresIn: "10m" })

  const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;
  console.log({decodedRefreshToken})
  await addRefreshTokenToDatabase(decodedRefreshToken.jti!, decodedRefreshToken.exp!)

  return {
    accessToken, 
    refreshToken
  }
}

authRouter.post("/verify_refresh_token", async (req, res) => {
  const {refreshToken, username} = req.body;
  console.log({refreshToken})
  const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JwtPayload
  if (decodedRefreshToken.username != username) {
    res.status(400).send({
      message: "refresh is token not for you"
    })
  }
  console.log({decodedRefreshToken})
  const refreshTokenIsValid = await getValidRefreshTokenDBRecord(decodedRefreshToken.jti!)
  console.log({refreshTokenIsValid})
  if (!refreshTokenIsValid) {
    res.status(400).send({
      message: "refresh token invalid, please login to get a new one"
    })
  }
  const newAccessToken = jwt.sign({
    username
    },
    process.env.JWT_SECRET!,
    {expiresIn: "2m"}
  )

  res.status(200).send({
    accessToken: newAccessToken
  })
})

authRouter.get("/hello_world", verifyAccessToken, async (req, res) => {
  res.status(200).send({
    message: "hello world!"
  })

})