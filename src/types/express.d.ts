// import { User } from "@prisma/client";

import { User } from "../generated/prisma/client";
import { IAuthUser } from "./common";

export interface JwtUser  {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser; // 👈 use `any` if you want, but this is better
    }
  }
}


export {};
