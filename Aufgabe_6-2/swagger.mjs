import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Bibliothek API',
        description: 'Automatisch generierte Swagger-Dokumentation für Books und Lends',
        version: '1.0.0',
    },
    host: 'localhost:3001',
    basePath: '/',
    schemes: ['http'],
    tags: [
        {
            name: 'Books',
            description: 'Alle Endpunkte rund um Bücher',
        },
        {
            name: 'Lends',
            description: 'Alle Endpunkte rund um das Ausleihen von Büchern',
        },
    ],
    definitions: {
        Book: {
            isbn: '123-456',
            title: '1984',
            year: 1949,
            author: 'George Orwell',
        },
        Lend: {
            id: '321',
            customerID: 'cust001',
            isbn: '123-456',
            borrowed_at: '2023-03-01T10:00:00Z',
            returned_at: '2023-03-15T10:00:00Z',
        },
    },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./main.mjs'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    console.log('swagger.json wurde erfolgreich generiert!');
});
