import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
    { isbn: '123-456', title: '1984', year: 1949, author: 'George Orwell' },
    { isbn: '789-012', title: 'Der Prozess', year: 1925, author: 'Franz Kafka' },
];

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
    const { isbn } = req.params;
    const book = books.find((b) => b.isbn === isbn);

    if (!book) {
        return res.status(404).json({ error: 'Buch nicht gefunden' });
    }

    res.json(book);
});

app.post('/books', (req, res) => {
    const { isbn, title, year, author } = req.body;

    const newBook = { isbn, title, year, author };

    if (!isBookValid(newBook)) {
        return res.status(422).json({
            error: 'Bitte alle Felder (isbn, title, year, author) korrekt ausfüllen.',
        });
    }

    const existingBook = books.find((b) => b.isbn === isbn);
    if (existingBook) {
        return res.status(409).json({ error: 'Buch mit dieser ISBN existiert bereits.' });
    }

    books.push(newBook);
    res.status(201).json(newBook);
});

app.put('/books/:isbn', (req, res) => {
    const { isbn } = req.params;
    const bookIndex = books.findIndex((b) => b.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Buch nicht gefunden' });
    }

    const { title, year, author } = req.body;
    const updatedBook = { isbn, title, year, author };

    if (!isBookValid(updatedBook)) {
        return res.status(422).json({
            error: 'Bitte alle Felder (isbn, title, year, author) korrekt ausfüllen.',
        });
    }

    books[bookIndex] = updatedBook;
    res.json(updatedBook);
});

app.patch('/books/:isbn', (req, res) => {
    const { isbn } = req.params;
    const bookIndex = books.findIndex((b) => b.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Buch nicht gefunden' });
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
    const { isbn } = req.params;
    const bookIndex = books.findIndex((b) => b.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Buch nicht gefunden' });
    }

    books.splice(bookIndex, 1);
    res.status(204).send(); // 204 = No Content
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
