import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json'assert { type: 'json' };

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let books = [
    {isbn: '123-456', title: '1984', year: 1949, author: 'George Orwell'},
    {isbn: '789-012', title: 'Der Prozess', year: 1925, author: 'Franz Kafka'},
    {isbn: '111-222', title: 'Brave New World', year: 1932, author: 'Aldous Huxley'},
    {isbn: '333-444', title: 'Fahrenheit 451', year: 1953, author: 'Ray Bradbury'},
    {isbn: '555-666', title: 'Animal Farm', year: 1945, author: 'George Orwell'}
];


let lends = [
    {id: '321', customerID: 'cust001', isbn: '123-456', borrowed_at: '2023-03-01T10:00:00Z', returned_at: '2023-03-15T10:00:00Z'},
    {id: '654', customerID: 'cust002', isbn: '789-012', borrowed_at: '2023-03-05T15:00:00Z', returned_at: '2023-03-20T11:30:00Z'},
];

app.get('/lends', (req, res) => {
    res.json(lends);
});

app.get('/lends/:id', (req, res) => {
    const id = req.params.id;
    const lend = lends.find((lend) => lend.id === id);

    if (!lend) {
        return res.status(404).json({error: 'Buch nicht gefunden'});
    }

    res.json(lend);
});

/**
 * @swagger
 * /lends:
 *   post:
 *     tags:
 *       - Lends
 *     summary: Legt einen neuen "Lend" an
 *     description: Fügt einen neuen "Lend" hinzu, sofern noch keine Ausleihe mit der gleichen ID existiert.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Lend'
 *     responses:
 *       201:
 *         description: "Lend" wurde erfolgreich erstellt.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Lend'
 *       409:
 *         description: "Lend" existiert bereits.
 */
app.post('/lends', (req, res) => {
    const newLend = req.body;

    const existingLend = lends.find((lend) => lend.id === newLend.id);
    if (existingLend) {
        return res.status(409).json({error: 'Buch mit dieser ISBN existiert bereits.'});
    }

    books.push(newLend);
    res.status(201).json(newLend);
});

app.delete('/lends/:id', (req, res) => {
    const id = req.params.id;
    const LendsIndex = lends.findIndex((lend) => lend.id === id);
    if (LendsIndex === -1) {
        return res.status(404).json({error: 'Buch nicht gefunden'});
    }
    books.splice(LendsIndex, 1);
    res.status(204).send();
});



function isBookValid(book) {
    if (!book.isbn || book.isbn.trim() === '') return false;
    if (!book.title || book.title.trim() === '') return false;
    if (book.year === undefined || book.year === null || book.year === '' || Number(book.year) <= 0) return false;
    if (!book.author || book.author.trim() === '') return false;
    return true;
}

app.get('/books', (req, res) => {
    res.json(books);
});

app.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find((b) => b.isbn === isbn);

    if (!book) {
        return res.status(404).json({error: 'Buch nicht gefunden'});
    }

    res.json(book);
});

app.post('/books', (req, res) => {
    const {isbn, title, year, author} = req.body;

    const newBook = {isbn, title, year, author};

    if (!isBookValid(newBook)) {
        return res.status(422).json({
            error: 'Bitte alle Felder (isbn, title, year, author) korrekt ausfüllen.',
        });
    }

    const existingBook = books.find((b) => b.isbn === isbn);
    if (existingBook) {
        return res.status(409).json({error: 'Buch mit dieser ISBN existiert bereits.'});
    }

    books.push(newBook);
    res.status(201).json(newBook);
});

app.put('/books/:isbn', (req, res) => {
    const {isbn} = req.params.isbn;
    const bookIndex = books.findIndex((b) => b.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({error: 'Buch nicht gefunden'});
    }

    const {title, year, author} = req.body;
    const updatedBook = {isbn, title, year, author};

    if (!isBookValid(updatedBook)) {
        return res.status(422).json({
            error: 'Bitte alle Felder (isbn, title, year, author) korrekt ausfüllen.',
        });
    }

    books[bookIndex] = updatedBook;
    res.json(updatedBook);
});

app.patch('/books/:isbn', (req, res) => {
    const {isbn} = req.params.isbn;
    const bookIndex = books.findIndex((b) => b.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({error: 'Buch nicht gefunden'});
    }

    const currentBook = books[bookIndex];

    const updatedBook = {
        ...currentBook,
        ...req.body,
    };

    if (!isBookValid(updatedBook)) {
        return res.status(422).json({
            error: 'Bitte alle Felder (isbn, title, year, author) korrekt ausfüllen.',
        });
    }

    books[bookIndex] = updatedBook;
    res.json(updatedBook);
});

app.delete('/books/:isbn', (req, res) => {
    const {isbn} = req.params;
    const bookIndex = books.findIndex((b) => b.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({error: 'Buch nicht gefunden'});
    }

    books.splice(bookIndex, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
