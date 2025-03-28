import express from 'express';

const port = 8080;

const app = express();

app.get('/', (request, response) => {
    response.send('Moin!');
});


app.listen(port, () => {
    console.log(`Port: ${port}`);
});