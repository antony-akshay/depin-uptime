// import { clerkMiddleware } from '@clerk/nextjs/server';

import type { NextFunction ,Request,Response} from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "./config";

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];
  if(!token){
    return res.status(402).json({error:'Unauthorized ahn ketto'});
  }

  const decoded = jwt.verify(token,JWT_PUBLIC_KEY);
  console.log(decoded);
  if(!decoded || !decoded.sub){
    return res.status(402).json({error:'Unauthorized ahn ketto'});
  }

  req.userId = decoded.sub as string;
  next()
}