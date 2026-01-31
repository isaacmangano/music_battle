import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken";

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log({req})
    const unsplitAccessToken = req.get("authorization");
    if (!unsplitAccessToken) {
      // throw error
      res.status(400).send({
        message: "No access token"
      });
    }
    console.log({unsplitAccessToken})
    const accessToken = unsplitAccessToken.split(" ")[1];
    console.log({accessToken})
    const decoded = jwt.verify(accessToken!, process.env.JWT_SECRET!) as JwtPayload;
    console.log({decoded})
    req.username = decoded.username;
    next();
  } catch (error) {
    // throw error
    console.error({error})
    res.status(500).send({
      message: error.message || "Unknown server error"
    })
    
  }
}

const verifyRefreshToken = () => {}