import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';;

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
app.use(express.json());

app.listen(3000, () => {
    console.log(`Server berhasil berjalan di port: 3000`);
})

app.get('/', (request, response) => {
    const nama = 'Andreas';
    response.send(`<h1>Hai ${nama}, Selamat datang di Facebook</h1>`);
    // response.json({message: 'Hello World'})
})

app.use('/api/user', userRoute); 
app.use('/api/auth', authRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});