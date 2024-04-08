import express from 'express'

const app = express(); // Express Object


const port = 3000;
app.listen(port, () => {
    console.log(`listen in port ${port}`);
})