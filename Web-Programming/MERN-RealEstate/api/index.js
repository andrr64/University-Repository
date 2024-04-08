import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

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
app.listen(process.env.PORT, () => {
    console.log(`Server berhasil berjalan...`);
})