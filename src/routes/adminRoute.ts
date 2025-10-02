import {Hono } from 'hono';
import { adminInterface, contentInterface, destinationInterface } from '../interfaces/admin';
import { prisma } from '..';
import { parse } from 'dotenv';

const adminRouter = new Hono();

adminRouter.get('/', (c) => {
    return c.text('Admin Home Page');
});

adminRouter.post('/create', async (c) => {
    const { email, name, password } : adminInterface = await c.req.json();
    await prisma.admin.create({ data : {
        email,
        name,
        password,
    }});
    return c.json({ message : 'Admin created successfully' } , 200 );
});

adminRouter.post("/create-destination" , async (c) => { 
    const body  = await c.req.json();
    const destinationObj : destinationInterface = { ...body , seats : parseInt(body.seats), price : parseInt(body.price)  , Discount : parseInt(body.Discount) };
    
    const newDestination = await prisma.destination.create({ data : destinationObj });
    return c.json({ message : 'Destination created successfully' ,
    destination : newDestination
    } , 200 );

});

adminRouter.post('/create-content' , async (c) => {
    const contenObj : contentInterface = await c.req.json();
    await prisma.displayContent.create({ data : contenObj });
    return c.json({ message : 'Content created successfully' } , 200 );
});



export default adminRouter;