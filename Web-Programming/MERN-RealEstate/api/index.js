import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';

dotenv.config();

mongoose
    .connect(process.env.MONGODB)
    .then(() => {
        console.log('Berhasil terhubung ke database...');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express(); // Express Object

app.listen(3000, () => {
    console.log(`Server berhasil berjalan...`);
})

app.get('/', (request, response) => {
    const nama = 'Andreas';
    response.send(`<h1>Hai ${nama}, Selamat datang di Facebook</h1>`);
    // response.json({message: 'Hello World'})
})

app.use('/api/user', userRoute); 