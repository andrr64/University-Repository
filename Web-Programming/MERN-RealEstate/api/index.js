import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';;
import listingRoute from './routes/listing.route.js';;
import cookieParser from 'cookie-parser';
import path from 'path';

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
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.listen(3000, () => {
    console.log(`Server berhasil berjalan di port: 3000`);
})

/*
app.get('/', (request, response) => {
    const nama = 'Andreas';
    response.send(`<h1>Hai ${nama}, Selamat datang di Facebook</h1>`);
    // response.json({message: 'Hello World'})
})
*/

app.use('/api/user', userRoute); 
app.use('/api/auth', authRoute);
app.use('/api/listing', listingRoute);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});