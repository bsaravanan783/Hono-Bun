import { Hono  } from 'hono'
import userRoute from './routes/userRoutes';
import {PrismaClient} from '@prisma/client';
import adminRouter from './routes/adminRoute';
import { jwt } from 'hono/jwt';
import authRoute from './routes/authRoute';

const app = new Hono();
export const prisma = new PrismaClient();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.use("/user/*", jwt({secret : process.env.JWT_USER_SECRET_KEY as string,
alg : "HS256" }));

app.use("/user/*", async (c, next) => {
    const jwtPayload = c.get('jwtPayload') as {email : string};
    
    const user = await prisma.user.findUnique({ where: { email: jwtPayload.email } })
    if (!user) {
        return c.json({ message: 'User not found' }, 401)
    }
    // "req.user" equivalent
    c.set('user', user)
    await next()
 });

 
app.use("/admin/*", jwt({secret : process.env.JWT_ADMIN_SECRET_KEY as string,
alg : "HS256" }));

app.use("/admin/*", async (c, next) => {
    const jwtPayload = c.get('jwtPayload') as {email : string};
    
    const user = await prisma.admin.findUnique({ where: { email: jwtPayload.email } })
    if (!user) {
        return c.json({ message: 'User not found' }, 401)
    }
    // "req.user" equivalent
    c.set('user', user)
    await next()
 });

app.route("/auth",authRoute); 
app.route("/user",userRoute);
app.route("/admin",adminRouter);
export default app;
