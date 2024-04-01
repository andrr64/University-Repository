import express from "express";
import {PORT} from "./config.js"

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