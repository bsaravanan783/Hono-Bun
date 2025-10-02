import { Hono } from "hono";
import { prisma } from "..";
import { jwtPayload } from "../interfaces/auth";
import { sign } from "hono/jwt";

const authRoute = new Hono();

authRoute.post('/user/signin' , async (c) => {
    const { email} : { email : string } = await c.req.json();
    const user = await prisma.user.findUnique({
        where : {
            email : email
        }
    });

    if(!user) {
        return c.json({ message : 'User not found' } , 404 );
    }
    const jwtPayload : jwtPayload = { 
        id : user.id,
        email : user.email,
        exp : Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
    }
    const jwtSecret : string = process.env.JWT_USER_SECRET_KEY as string; 
    const token  = await sign(jwtPayload,jwtSecret, process.env.JWT_ALGORITHM );

    return c.json ( { message : 'User signed in successfully' , token } , 200 );
})


authRoute.post('/admin/signin' , async (c) => {
    const { email} : { email : string } = await c.req.json();
    const admin = await prisma.admin.findUnique({
        where : {
            email : email
        }
    });

    if(!admin) {
        return c.json({ message : 'admin not found' } , 404 );
    }
    const jwtPayload : jwtPayload = { 
        id : admin.id,
        email : admin.email,
        exp : Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
    }
    const jwtSecret : string = process.env.JWT_ADMIN_SECRET_KEY as string; 
    const token  = await sign(jwtPayload,jwtSecret, process.env.JWT_ALGORITHM as string);

    return c.json ( { message : 'Admin signed in successfully' , token } , 200 );
})


export default authRoute;