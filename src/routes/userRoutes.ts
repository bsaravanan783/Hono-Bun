import {Hono} from 'hono';
import {prisma} from '../index';
import { UserInterface } from '../interfaces/user';
import {decode , sign , verify} from 'hono/jwt';
import dotenv from 'dotenv';
import { jwtPayload } from '../interfaces/auth';
dotenv.config();

const userRoute = new Hono();

userRoute.get('/', (c) => { 
    return c.text('User Home Page');
});

userRoute.post('/create' , async(c)=> {
    const {name, email , rollno , phoneNumber} : UserInterface = await c.req.json();
    const newUser = await prisma.user.create({data : {
        email,
        name,
        rollno,
        phoneNumber,

    } })
    return c.json(newUser);
});

// userRoute.post('/signup' , async (c) => {
//     const { name, email, rollno, phoneNumber } : UserInterface = await c.req.json();
// })

userRoute.get('/destinations/all' , async (c) => {
    const destinations = await prisma.destination.findMany({
        where : {isAvailable : true }
    });
    return c.json(destinations);
});

userRoute.get('/destinations/:id' , async (c) => {
    const id = c.req.param('id');
    const destination = await prisma.destination.findUnique({
        where : { id : Number(id) }
    });
    if(!destination) {
        return c.json({ message : 'Destination not found' } , 404 );
    }
    return c.json(destination);
});

userRoute.get('/content' , async (c) => {
    const content = await prisma.displayContent.findFirst({
        where : { isActive : true }
    });
    return c.json(content);
});

userRoute.get("/bookings" , async (c) => {
    const bookings = await prisma.booking.findMany({
        where : { userId : c.get('user').id }
    });
    return c.json(bookings);
})

userRoute.get("/bookings/:id" , async (c) => {
    const bookingId = c.req.param('id');
    const booking = await prisma.booking.findFirst({
        where : { id : parseInt(bookingId) , userId : c.get('user').id }
    });

    return c.json(booking);
});

export default userRoute;