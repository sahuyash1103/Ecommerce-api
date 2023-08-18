'use strict';

const express = require('express');
const morgan = require('morgan');

const { PORT } = require('./src/utils/getEnv');

let error;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.json({ message: 'server is runnin...', error: error }).status(200);
});

app.get('/api/', (req, res) => {
    res.json({ message: 'server is runnin...', error: error }).status(200);
});

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}...`);
})