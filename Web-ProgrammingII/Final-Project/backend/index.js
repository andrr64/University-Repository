import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import {mongoose} from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

app.use(express.json()); // Middleware for parsing request body

// HTTP Routes
// app.get($route, $callbackFunction(req, resp))
// This is main/root route
app.get('/',(request, response) =>{
    console.log(request);
    return response.status(234).send('Welcome to the MERN tutorial')
});

app.listen(PORT, () =>{
    console.log(`App is listening to port: ${PORT}`);
});

// Rute untuk memasukan data buku
app.post('/books', async (request, response) => {
    try {
        if (!request.body.title || !request.body.author || !request.body.publishYear){
            // Jika data pada model book ada yang tidak diisi maka
            return response.status(400).send({
                message: 'Send all required fields: title, author and publishYear',
            })
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        }
        const book = await Book.create(newBook);
        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Rute untuk mengambil data buku
app.get('/books', async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).send({
            'count': books.length,
            'data': books
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

mongoose
    .connect(mongoDBURL)
    .then(() =>{
        console.log('App connected to database');
    })
    .catch((error) =>{
        console.log(error);
    });

