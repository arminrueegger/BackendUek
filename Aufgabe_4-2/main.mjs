import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import { DateTime } from 'luxon';

const port = 8080;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const names = [
    'Armin', 'Sandro', 'Mario', 'Phillip', 'Erik', 'Fiona', 'Gustav', 'Hanna',
    'Igor', 'Julia', 'Fynn', 'Stefan', 'Lena', 'Klaus', 'Mona', 'Nina', 'Olaf',
    'Silvan', 'Quentin', 'Rita', 'Sven', 'Tina', 'Uwe', 'Vera', 'Wolfgang',
    'Xenia', 'Yvonne', 'Zacharias'
];
const jsonPath = path.join(__dirname, 'user.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/now', (req, res) => {
    const tz = req.query.tz || 'UTC';
    if (!DateTime.local().setZone(tz).isValid) return res.status(400).send('Invalid timezone');
    const time = DateTime.now().setZone(tz).toFormat('yyyy-MM-dd HH:mm');
    res.send(time);
});

app.post('/names', (req, res) => {
    const name = req.body.name;
    if (!name) return res.status(400).send('Name required');
    names.push(name);
    res.status(201).send(`Added: ${name}`);
});

app.delete('/names', (req, res) => {
    const name = req.query.name;
    const index = names.indexOf(name);
    if (index > -1) {
        names.splice(index, 1);
        res.sendStatus(204);
    } else {
        res.status(404).send('Name not found');
    }
});

app.get('/secret2', (req, res) => {
    const auth = req.headers.authorization;
    if (auth === 'Basic aGFja2VyOjEyMzQ=') {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

app.get('/chuck', (req, res) => {
    const name = req.query.name;
    fetch('https://api.chucknorris.io/jokes/random')
        .then(result => result.json())
        .then(data => {
            let joke = data.value;
            if (name) joke = joke.replace(/Chuck Norris/g, name);
            res.send(joke);
        })
        .catch(() => res.status(500).send('Error fetching joke'));
});

app.patch('/me', (req, res) => {
    fs.readFile(jsonPath, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('File read error');
        let user = JSON.parse(data);
        const updated = { ...user, ...req.body };
        fs.writeFile(jsonPath, JSON.stringify(updated, null, 2), (err) => {
            if (err) return res.status(500).send('Write error');
            res.send(updated);
        });
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
