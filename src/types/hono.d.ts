import 'hono';

import type { User , Admin } from '@prisma/client';

declare module 'hono' {
    interface ContextVariableMap {
        user : User | Admin;
        jwtPayload : {
        email : string,
        id?  : number,
        };
    }
}