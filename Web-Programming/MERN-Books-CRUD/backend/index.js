import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import {mongoose} from "mongoose";
import  booksRoute from "./routes/bookRoute.js";
import cors from 'cors';

const app = express();

app.use(express.json()); // Middleware for parsing request body
// Middleware for handling CORS policy
// 1. Allow All origins with default cors
app.use(cors());
// 2. Allow specific origins
// app.use(
//     cors({
//         origin: 'http://localhost:5173',
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type']
//     })
// );

// HTTP Routes
// app.get($route, $callbackFunction(req, resp))
// This is main/root route
app.get('/',(request, response) =>{
    return response.status(234).send('Welcome to the MERN tutorial')
});

app.use('/books', booksRoute);

app.listen(PORT, () =>{
    console.log(`App is listening to port: ${PORT}`);
});

mongoose
    .connect(mongoDBURL)
    .then(() =>{
        console.log('App connected to database');
    })
    .catch((error) =>{
        console.log(error);
    });

