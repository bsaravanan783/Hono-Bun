import { JWTPayload } from "hono/utils/jwt/types";

interface jwtPayload extends JWTPayload{
    id : number;
    email : string;
}

export { jwtPayload }