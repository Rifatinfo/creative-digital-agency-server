// import { User } from "@prisma/client";

import { User } from "../generated/prisma/client";

interface JwtUser {
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
