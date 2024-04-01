import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import {mongoose} from "mongoose";

const app = express();
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

mongoose
    .connect(mongoDBURL)
    .then(() =>{
        console.log('App connected to database');
    })
    .catch((error) =>{
        console.log(error);
    });