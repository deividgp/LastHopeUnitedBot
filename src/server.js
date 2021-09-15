const express = require('express');
const cors = require('cors');
const path = require('path');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.middlewares();
        this.routes();
        this.listen();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static(path.join(__dirname + '/public')));
    }

    routes() {
        this.app.get('/', (request, response) => {
            return response.sendFile('index.html', { root: 'src/public' });
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;