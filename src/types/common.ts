// import { UserRole } from "../generated/prisma/enums";

import { UserRole } from "@prisma/client";

export type IAuthUser = {
    email: string;
    role: UserRole
} ;