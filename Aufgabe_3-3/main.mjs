import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const port = 8080;
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function zeroFill(number) {
    return (number < 10 ? '0' : '') + number;
}

const date = new Date();
const year = date.getFullYear();
const month = zeroFill(date.getMonth() + 1);
const day = zeroFill(date.getDate());
const hours = zeroFill(date.getHours());
const minutes = zeroFill(date.getMinutes());
const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}\n`;

const names = [
    'Armin', 'Sandro', 'Mario', 'Phillip', 'Erik', 'Fiona', 'Gustav', 'Hanna',
    'Igor', 'Julia', 'Fynn', 'Stefan', 'Lena', 'Klaus', 'Mona', 'Nina', 'Olaf',
    'Silvan', 'Quentin', 'Rita', 'Sven', 'Tina', 'Uwe', 'Vera', 'Wolfgang',
    'Xenia', 'Yvonne', 'Zacharias'
];

const filePath = path.join(__dirname, 'random.html');
const imagePath = path.join(__dirname, 'brainrot.jpg');
const xmlPath = path.join(__dirname, 'index.xml');
const jsonPath = path.join(__dirname, 'user.json');

app.get('/now', (request, response) => {
    response.send(formattedDate);
});

app.get('/zli', (request, response) => {
    response.redirect('https://www.zli.ch');
});

app.get('/name', (request, response) => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    response.send(randomName);
});

app.get('/html', (request, response) => {
    response.sendFile(filePath);
});

app.get('/image', (request, response) => {
    response.sendFile(imagePath);
});

app.get('/teapot', (request, response) => {
    response.status(418).send('I am a teapot :)');
});

app.get('/user-agent', (request, response) => {
    response.send(request.headers['user-agent']);
});

app.get('/secret', (request, response) => {
    response.status(403).send('Access denied :(');
});

app.get('/xml', (request, response) => {
    response.sendFile(xmlPath);
});

app.get('/me', (request, response) => {
    response.sendFile(jsonPath);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
