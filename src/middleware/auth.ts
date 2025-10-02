import { jwt, verify } from "hono/jwt";
import { prisma } from "..";
import { jwtPayload } from "../interfaces/auth";

const authMiddleware = async (c, next) => {
    const authHeader = c.req.headers.get('Authorization');
    if (!authHeader) {
        return c.json({ message: 'Authorization header missing' }, 401);
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return c.json({ message: 'Token missing' }, 401);
    }
    const secret = "My_secret_Key";
    
    try {
        const decodedPayload = await verify(token , secret , process.env.JWT_ALGORITHM ) as jwtPayload;

         await prisma.user.findUniqueOrThrow({
            where : {
                email : decodedPayload.email
            }
        });

        await next();
    }catch (error) {
        return c.json({ message: 'Invalid token' }, 401);
    }
}



const app = " ";


app.use("/protected-route/*", jwt({secret : process.env.JWT_SECRET_KEY as string,
alg : "HS256" }));

app.use("/protected-route/*", async (c, next) => {
    const jwtPayload = c.get("jwtpayload") as {email : string};
    
    const user = await prisma.user.findUnique({ where: { email: payload.email } })
    if (!user) {
        return c.json({ message: 'User not found' }, 401)
    }

    // "req.user" equivalent
    c.set('user', user)

    await next()
 });