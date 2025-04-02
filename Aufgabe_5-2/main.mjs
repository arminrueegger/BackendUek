import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
    {isbn: '123-456', title: '1984', year: 1949, author: 'George Orwell', isLent: true},
    {isbn: '789-012', title: 'Der Prozess', year: 1925, author: 'Franz Kafka', isLent: true},
    {isbn: '111-222', title: 'Brave New World', year: 1932, author: 'Aldous Huxley', isLent: false},
    {isbn: '333-444', title: 'Fahrenheit 451', year: 1953, author: 'Ray Bradbury', isLent: false},
    {isbn: '555-666', title: 'Animal Farm', year: 1945, author: 'George Orwell', isLent: false}
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
        return res.status(404).json({error: 'Ausleihe nicht gefunden'});
    }

    res.json(lend);
});

app.post('/lends', (req, res) => {
    const newLend = req.body;
    const existingLend = lends.find((lend) => lend.id === newLend.id);
    if (existingLend) {
        return res.status(409).json({error: 'Ausleihe existiert bereits.'});
    }

    const book = books.find((book) => book.isbn === newLend.isbn);
    if (!book) {
        return res.status(404).json({error: 'Buch nicht gefunden'});
    }
    if (book.isLent) {
        return res.status(409).json({error: 'Buch ist verlieen.'});
    }

    const activeLends = lends.filter(lend =>
        lend.customerID === newLend.customerID && !lend.returned_at
    );
    if (activeLends.length >= 3) {
        return res.status(409).json({error: 'Kunde hat bereits 3 aktive ausleihen.'});
    }

    lends.push(newLend);
    book.isLent = true;

    res.status(201).json(newLend);
});

app.delete('/lends/:id', (req, res) => {
    const id = req.params.id;
    const lendIndex = lends.findIndex((lend) => lend.id === id);
    if (lendIndex === -1) {
        return res.status(404).json({error: 'ausleihe nicht gefunden'});
    }
    const lend = lends[lendIndex];
    const book = books.find(book => book.isbn === lend.isbn);
    if (book) {
        book.isLent = false;
    }
    lends.splice(lendIndex, 1);
    res.status(204).send();
});

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

function isBookValid(book) {
    return book.isbn && book.title && book.year && book.author;
}

app.post('/books', (req, res) => {
    const {isbn, title, year, author} = req.body;

    const newBook = {isbn, title, year, author, isLent: false};

    if (!isBookValid(newBook)) {
        return res.status(422).json({
            error: 'Bitte alle Felder korrekt ausfüllen.',
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
    const isbn = req.params.isbn;
    const bookIndex = books.findIndex((b) => b.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({error: 'Buch nicht gefunden'});
    }

    const {title, year, author} = req.body;
    const updatedBook = {isbn, title, year, author, isLent: books[bookIndex].isLent};

    if (!isBookValid(updatedBook)) {
        return res.status(422).json({
            error: 'Bitte alle Felder korrekt ausfüllen.',
        });
    }

    books[bookIndex] = updatedBook;
    res.json(updatedBook);
});

app.patch('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
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
            error: 'Bitte alle Felder korrekt ausfüllen.',
        });
    }

    books[bookIndex] = updatedBook;
    res.json(updatedBook);
});

app.delete('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
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
