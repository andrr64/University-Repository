import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import {mongoose} from "mongoose";
import { Book } from "./models/bookModel.js";
import  booksRoute from "./routes/bookRoute.js";


const app = express();

app.use(express.json()); // Middleware for parsing request body

// HTTP Routes
// app.get($route, $callbackFunction(req, resp))
// This is main/root route
app.get('/',(request, response) =>{
    console.log(request);
    return response.status(234).send('Welcome to the MERN tutorial')
});

app.use('/books', booksRoute);

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

// Rute untuk mengambil data buku dengan id tertentu
app.get('/books/:id', async(request, response) =>{
    try {
        const { id } = request.params;
        const book = await Book.findById(id);
        return response.status(200).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Rute untuk mengupdate data dengan id tertentu
app.post('/books/:id', async(request, response) => {
    try {
        if (!request.body.title || !request.body.author || !request.body.publishYear){
            // Jika data pada model book ada yang tidak diisi maka
            return response.status(400).send({
                message: 'Send all required fields: title, author and publishYear',
            });
        }
        const {id} = request.params;
        const result = await Book.findByIdAndUpdate(id, request.body);
        if (!result){
            return response.status(400).json({message: 'Book not found'});
        }
        return response.status(200).send({message: 'Book updated successfully'});   
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Rute untuk menghapus data dengan id tertentu
app.delete('/book/:id', async(request, response) => {
    try {
        const {id} = request.params;
        const result = await Book.findByIdAndDelete(id);
        if(!result){
            return response.status(404).json({message: 'Book not found'});
        }
        return response.status(200).send({message: 'Book deleted successfully'})
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

